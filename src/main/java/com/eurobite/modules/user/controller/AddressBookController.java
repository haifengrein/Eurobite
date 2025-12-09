package com.eurobite.modules.user.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.user.entity.AddressBook;
import com.eurobite.modules.user.service.AddressBookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address-book")
@RequiredArgsConstructor
@Tag(name = "Address Book", description = "User Addresses")
public class AddressBookController {

    private final AddressBookService addressBookService;

    @GetMapping
    @Operation(summary = "List My Addresses")
    public R<List<AddressBook>> list() {
        return R.success(addressBookService.list());
    }

    @PostMapping
    @Operation(summary = "Add Address")
    public R<AddressBook> save(@RequestBody AddressBook addressBook) {
        return R.success(addressBookService.save(addressBook));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Address")
    public R<AddressBook> update(@PathVariable Long id, @RequestBody AddressBook addressBook) {
        return R.success(addressBookService.update(id, addressBook));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Address")
    public R<String> delete(@PathVariable Long id) {
        addressBookService.delete(id);
        return R.success("Address deleted");
    }
}
