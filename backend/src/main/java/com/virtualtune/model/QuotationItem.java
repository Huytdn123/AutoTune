package com.virtualtune.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "QuotationItems")
public class QuotationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_id", nullable = false)
    @JsonIgnore
    private Quotation quotation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "part_id")
    private Part part;

    @Column(name = "part_name", nullable = false, length = 150)
    private String partName;

    @Column(name = "part_sku", length = 50)
    private String partSku;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price_vnd", nullable = false)
    private Long unitPriceVnd = 0L;

    @Column(name = "total_price_vnd", nullable = false)
    private Long totalPriceVnd = 0L;

    public QuotationItem() {}

    public QuotationItem(Long itemId, Quotation quotation, Part part, String partName, String partSku,
                         String category, Integer quantity, Long unitPriceVnd, Long totalPriceVnd) {
        this.itemId = itemId;
        this.quotation = quotation;
        this.part = part;
        this.partName = partName;
        this.partSku = partSku;
        this.category = category;
        this.quantity = quantity != null ? quantity : 1;
        this.unitPriceVnd = unitPriceVnd != null ? unitPriceVnd : 0L;
        this.totalPriceVnd = totalPriceVnd != null ? totalPriceVnd : (this.unitPriceVnd * this.quantity);
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Quotation getQuotation() {
        return quotation;
    }

    public void setQuotation(Quotation quotation) {
        this.quotation = quotation;
    }

    public Part getPart() {
        return part;
    }

    public void setPart(Part part) {
        this.part = part;
    }

    public String getPartName() {
        return partName;
    }

    public void setPartName(String partName) {
        this.partName = partName;
    }

    public String getPartSku() {
        return partSku;
    }

    public void setPartSku(String partSku) {
        this.partSku = partSku;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        if (this.unitPriceVnd != null && this.quantity != null) {
            this.totalPriceVnd = this.unitPriceVnd * this.quantity;
        }
    }

    public Long getUnitPriceVnd() {
        return unitPriceVnd;
    }

    public void setUnitPriceVnd(Long unitPriceVnd) {
        this.unitPriceVnd = unitPriceVnd;
        if (this.unitPriceVnd != null && this.quantity != null) {
            this.totalPriceVnd = this.unitPriceVnd * this.quantity;
        }
    }

    public Long getTotalPriceVnd() {
        return totalPriceVnd;
    }

    public void setTotalPriceVnd(Long totalPriceVnd) {
        this.totalPriceVnd = totalPriceVnd;
    }
}
