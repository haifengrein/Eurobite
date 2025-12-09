package com.eurobite.modules.setmeal.service;

import com.eurobite.modules.setmeal.dto.SetmealDTO;
import com.eurobite.modules.setmeal.entity.Setmeal;
import com.eurobite.modules.setmeal.entity.SetmealDish;
import com.eurobite.modules.setmeal.mapper.SetmealMapper;
import com.eurobite.modules.setmeal.repository.SetmealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SetmealService {

    private final SetmealRepository setmealRepository;
    private final SetmealMapper setmealMapper;

    @Transactional
    public void saveWithDish(SetmealDTO dto) {
        Setmeal setmeal = setmealMapper.toEntity(dto);
        
        if (dto.setmealDishes() != null) {
            List<SetmealDish> dishes = dto.setmealDishes().stream()
                    .map(setmealMapper::toDishEntity)
                    .peek(d -> d.setSetmeal(setmeal))
                    .collect(Collectors.toList());
            setmeal.setSetmealDishes(dishes);
        }
        setmealRepository.save(setmeal);
    }
    
    @Transactional
    public void removeWithDish(List<Long> ids) {
        // TODO: Check status (on sale cannot be deleted)
        setmealRepository.deleteAllById(ids);
    }

    @Transactional(readOnly = true)
    public SetmealDTO getById(Long id) {
        Setmeal entity = setmealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Setmeal not found"));
        return setmealMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public List<SetmealDTO> listByCategory(Long categoryId) {
        if (categoryId == null) {
            return setmealRepository.findAll().stream()
                    .map(setmealMapper::toDTO)
                    .collect(Collectors.toList());
        }
        return setmealRepository.findAll().stream()
                .filter(s -> categoryId.equals(s.getCategoryId()))
                .map(setmealMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateWithDish(SetmealDTO dto) {
        if (dto.id() == null) {
            throw new IllegalArgumentException("Setmeal id is required for update");
        }
        Setmeal existing = setmealRepository.findById(dto.id())
                .orElseThrow(() -> new IllegalArgumentException("Setmeal not found"));

        // 简单字段覆盖
        existing.setCategoryId(dto.categoryId());
        existing.setName(dto.name());
        existing.setPrice(dto.price());
        existing.setStatus(dto.status());
        existing.setDescription(dto.description());
        existing.setImage(dto.image());

        // 替换内部 SetmealDish 列表
        existing.getSetmealDishes().clear();
        if (dto.setmealDishes() != null) {
            List<SetmealDish> dishes = dto.setmealDishes().stream()
                    .map(setmealMapper::toDishEntity)
                    .peek(d -> d.setSetmeal(existing))
                    .collect(Collectors.toList());
            existing.getSetmealDishes().addAll(dishes);
        }

        setmealRepository.save(existing);
    }
}
