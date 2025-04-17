package com.myapp.ecommerce.repository;

import com.myapp.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    Page<Product> findByActiveTrue(Pageable pageable);
    
    @Query("{ 'active': true, " +
           "'category': ?0, " +
           "'price': { $gte: ?1, $lte: ?2 }, " +
           "'rating': { $gte: ?3 } }")
    Page<Product> findByFilters(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            double minRating,
            Pageable pageable
    );

    List<Product> findByCategoryAndIdNot(String category, String productId);
    
    List<Product> findByCategory(String category);

    Page<Product> findByCategoryAndActiveTrue(String category, Pageable pageable);
    
    @Query(value = "{}", fields = "{}", count = true)
    List<String> findAllCategories();
    
    @Query(value = "{}", fields = "{_id: 0, category: 1}")
    List<String> findDistinctCategories();
}
