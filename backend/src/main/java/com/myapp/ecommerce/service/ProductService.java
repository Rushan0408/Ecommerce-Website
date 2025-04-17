package com.myapp.ecommerce.service;

import com.myapp.ecommerce.model.Product;
import com.myapp.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public Page<Product> getProducts(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            double minRating,
            String sort,
            int page,
            int size
    ) {
        Sort.Direction direction = sort.endsWith("-desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String property = sort.equals("featured") ? "rating" : sort.replace("-asc", "").replace("-desc", "");
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));
        
        if (category == null && minPrice == null && maxPrice == null && minRating == 0) {
            return productRepository.findByActiveTrue(pageable);
        }
        
        return productRepository.findByFilters(
                category,
                minPrice != null ? minPrice : BigDecimal.ZERO,
                maxPrice != null ? maxPrice : new BigDecimal("999999.99"),
                minRating,
                pageable
        );
    }

    public Product getProduct(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getRelatedProducts(String productId) {
        Product product = getProduct(productId);
        return productRepository.findByCategoryAndIdNot(product.getCategory(), productId);
    }

    public Set<String> getCategories() {
        // Get all products and extract distinct categories
        return productRepository.findAll().stream()
                .filter(product -> product.getCategory() != null && !product.getCategory().isEmpty())
                .map(Product::getCategory)
                .collect(Collectors.toSet());
    }

    public Product createProduct(Product product) {
        product.setActive(true);
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product product) {
        Product existingProduct = getProduct(id);
        product.setId(id);
        product.setCreatedAt(existingProduct.getCreatedAt());
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProduct(id);
        product.setActive(false);
        productRepository.save(product);
    }

    public Page<Product> getProductsByCategories(String category, String sort, int page, int size) {
    Sort.Direction direction = sort.endsWith("-desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    String property = sort.equals("featured") ? "rating" : sort.replace("-asc", "").replace("-desc", "");
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));
    if (category == null || category.isEmpty()) {
        return productRepository.findByActiveTrue(pageable);
    }
    return productRepository.findByCategoryAndActiveTrue(category, pageable);
}

    public List<Product> getProductsByCategories(String category) {
        return productRepository.findByCategory(category);
    }
}
