package com.eurobite.modules.user.service;

import com.eurobite.common.context.BaseContext;
import com.eurobite.common.exception.CustomException;
import com.eurobite.modules.user.entity.AddressBook;
import com.eurobite.modules.user.repository.AddressBookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressBookService {

    private final AddressBookRepository addressBookRepository;

    public List<AddressBook> list() {
        Long userId = BaseContext.getCurrentId();
        return addressBookRepository.findByUserId(userId);
    }

    @Transactional
    public AddressBook save(AddressBook addressBook) {
        Long userId = BaseContext.getCurrentId();
        addressBook.setUserId(userId);
        return addressBookRepository.save(addressBook);
    }

    @Transactional
    public AddressBook update(Long id, AddressBook addressBook) {
        Long userId = BaseContext.getCurrentId();
        AddressBook existing = addressBookRepository.findById(id)
                .orElseThrow(() -> new CustomException("Address not found"));
        
        if (!existing.getUserId().equals(userId)) {
            throw new CustomException("Access denied");
        }

        // Copy properties (simple manual copy or MapStruct, manual for now for speed)
        existing.setConsignee(addressBook.getConsignee());
        existing.setPhone(addressBook.getPhone());
        existing.setProvinceCode(addressBook.getProvinceCode());
        existing.setProvinceName(addressBook.getProvinceName());
        existing.setCityCode(addressBook.getCityCode());
        existing.setCityName(addressBook.getCityName());
        existing.setDistrictCode(addressBook.getDistrictCode());
        existing.setDistrictName(addressBook.getDistrictName());
        existing.setDetail(addressBook.getDetail());
        existing.setLabel(addressBook.getLabel());
        existing.setIsDefault(addressBook.getIsDefault());

        return addressBookRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Long userId = BaseContext.getCurrentId();
        AddressBook existing = addressBookRepository.findById(id)
                .orElseThrow(() -> new CustomException("Address not found"));
        if (!existing.getUserId().equals(userId)) {
            throw new CustomException("Access denied");
        }
        addressBookRepository.delete(existing);
    }
}
