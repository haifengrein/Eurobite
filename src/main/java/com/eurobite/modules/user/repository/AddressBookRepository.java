package com.eurobite.modules.user.repository;

import com.eurobite.modules.user.entity.AddressBook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressBookRepository extends JpaRepository<AddressBook, Long> {
    List<AddressBook> findByUserId(Long userId);
    List<AddressBook> findByUserIdAndIsDefaultTrue(Long userId);
}
