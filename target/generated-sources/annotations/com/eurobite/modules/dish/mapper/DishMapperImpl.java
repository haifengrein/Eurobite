package com.eurobite.modules.dish.mapper;

import com.eurobite.modules.dish.dto.DishDTO;
import com.eurobite.modules.dish.dto.DishFlavorDTO;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.entity.DishFlavor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-09T15:52:06+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class DishMapperImpl implements DishMapper {

    @Override
    public Dish toEntity(DishDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Dish dish = new Dish();

        dish.setId( dto.id() );
        dish.setName( dto.name() );
        dish.setCategoryId( dto.categoryId() );
        dish.setPrice( dto.price() );
        dish.setCode( dto.code() );
        dish.setImage( dto.image() );
        dish.setDescription( dto.description() );
        dish.setStatus( dto.status() );
        dish.setSort( dto.sort() );
        dish.setFlavors( dishFlavorDTOListToDishFlavorList( dto.flavors() ) );

        return dish;
    }

    @Override
    public DishDTO toDTO(Dish entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        Long categoryId = null;
        BigDecimal price = null;
        String code = null;
        String image = null;
        String description = null;
        Integer status = null;
        Integer sort = null;
        List<DishFlavorDTO> flavors = null;

        id = entity.getId();
        name = entity.getName();
        categoryId = entity.getCategoryId();
        price = entity.getPrice();
        code = entity.getCode();
        image = entity.getImage();
        description = entity.getDescription();
        status = entity.getStatus();
        sort = entity.getSort();
        flavors = dishFlavorListToDishFlavorDTOList( entity.getFlavors() );

        DishDTO dishDTO = new DishDTO( id, name, categoryId, price, code, image, description, status, sort, flavors );

        return dishDTO;
    }

    @Override
    public DishFlavor toFlavorEntity(DishFlavorDTO dto) {
        if ( dto == null ) {
            return null;
        }

        DishFlavor dishFlavor = new DishFlavor();

        dishFlavor.setName( dto.name() );
        dishFlavor.setValue( dto.value() );

        return dishFlavor;
    }

    @Override
    public DishFlavorDTO toFlavorDTO(DishFlavor entity) {
        if ( entity == null ) {
            return null;
        }

        String name = null;
        String value = null;

        name = entity.getName();
        value = entity.getValue();

        DishFlavorDTO dishFlavorDTO = new DishFlavorDTO( name, value );

        return dishFlavorDTO;
    }

    @Override
    public void updateDishFromDTO(DishDTO dto, Dish entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.id() );
        entity.setName( dto.name() );
        entity.setCategoryId( dto.categoryId() );
        entity.setPrice( dto.price() );
        entity.setCode( dto.code() );
        entity.setImage( dto.image() );
        entity.setDescription( dto.description() );
        entity.setStatus( dto.status() );
        entity.setSort( dto.sort() );
    }

    protected List<DishFlavor> dishFlavorDTOListToDishFlavorList(List<DishFlavorDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<DishFlavor> list1 = new ArrayList<DishFlavor>( list.size() );
        for ( DishFlavorDTO dishFlavorDTO : list ) {
            list1.add( toFlavorEntity( dishFlavorDTO ) );
        }

        return list1;
    }

    protected List<DishFlavorDTO> dishFlavorListToDishFlavorDTOList(List<DishFlavor> list) {
        if ( list == null ) {
            return null;
        }

        List<DishFlavorDTO> list1 = new ArrayList<DishFlavorDTO>( list.size() );
        for ( DishFlavor dishFlavor : list ) {
            list1.add( toFlavorDTO( dishFlavor ) );
        }

        return list1;
    }
}
