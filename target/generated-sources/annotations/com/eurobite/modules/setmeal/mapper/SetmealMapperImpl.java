package com.eurobite.modules.setmeal.mapper;

import com.eurobite.modules.setmeal.dto.SetmealDTO;
import com.eurobite.modules.setmeal.dto.SetmealDishDTO;
import com.eurobite.modules.setmeal.entity.Setmeal;
import com.eurobite.modules.setmeal.entity.SetmealDish;
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
public class SetmealMapperImpl implements SetmealMapper {

    @Override
    public Setmeal toEntity(SetmealDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Setmeal setmeal = new Setmeal();

        setmeal.setId( dto.id() );
        setmeal.setCategoryId( dto.categoryId() );
        setmeal.setName( dto.name() );
        setmeal.setPrice( dto.price() );
        setmeal.setStatus( dto.status() );
        setmeal.setDescription( dto.description() );
        setmeal.setImage( dto.image() );
        setmeal.setSetmealDishes( setmealDishDTOListToSetmealDishList( dto.setmealDishes() ) );

        return setmeal;
    }

    @Override
    public SetmealDTO toDTO(Setmeal entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        Long categoryId = null;
        String name = null;
        BigDecimal price = null;
        Integer status = null;
        String description = null;
        String image = null;
        List<SetmealDishDTO> setmealDishes = null;

        id = entity.getId();
        categoryId = entity.getCategoryId();
        name = entity.getName();
        price = entity.getPrice();
        status = entity.getStatus();
        description = entity.getDescription();
        image = entity.getImage();
        setmealDishes = setmealDishListToSetmealDishDTOList( entity.getSetmealDishes() );

        SetmealDTO setmealDTO = new SetmealDTO( id, categoryId, name, price, status, description, image, setmealDishes );

        return setmealDTO;
    }

    @Override
    public SetmealDish toDishEntity(SetmealDishDTO dto) {
        if ( dto == null ) {
            return null;
        }

        SetmealDish setmealDish = new SetmealDish();

        setmealDish.setDishId( dto.dishId() );
        setmealDish.setName( dto.name() );
        setmealDish.setPrice( dto.price() );
        setmealDish.setCopies( dto.copies() );

        return setmealDish;
    }

    @Override
    public SetmealDishDTO toDishDTO(SetmealDish entity) {
        if ( entity == null ) {
            return null;
        }

        Long dishId = null;
        String name = null;
        BigDecimal price = null;
        Integer copies = null;

        dishId = entity.getDishId();
        name = entity.getName();
        price = entity.getPrice();
        copies = entity.getCopies();

        SetmealDishDTO setmealDishDTO = new SetmealDishDTO( dishId, name, price, copies );

        return setmealDishDTO;
    }

    protected List<SetmealDish> setmealDishDTOListToSetmealDishList(List<SetmealDishDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<SetmealDish> list1 = new ArrayList<SetmealDish>( list.size() );
        for ( SetmealDishDTO setmealDishDTO : list ) {
            list1.add( toDishEntity( setmealDishDTO ) );
        }

        return list1;
    }

    protected List<SetmealDishDTO> setmealDishListToSetmealDishDTOList(List<SetmealDish> list) {
        if ( list == null ) {
            return null;
        }

        List<SetmealDishDTO> list1 = new ArrayList<SetmealDishDTO>( list.size() );
        for ( SetmealDish setmealDish : list ) {
            list1.add( toDishDTO( setmealDish ) );
        }

        return list1;
    }
}
