package com.virtualtune.seeder;

import com.virtualtune.model.Garage;
import com.virtualtune.model.Quotation;
import com.virtualtune.model.QuotationItem;
import com.virtualtune.model.User;
import com.virtualtune.model.WorkOrder;
import com.virtualtune.repository.GarageRepository;
import com.virtualtune.repository.QuotationRepository;
import com.virtualtune.repository.UserRepository;
import com.virtualtune.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class BuildAndOrderSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GarageRepository garageRepository;

    @Autowired
    private QuotationRepository quotationRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    public void seed() {
        if (quotationRepository.count() > 0) {
            return;
        }

        User customer = userRepository.findByUsername("customer_vip").orElse(null);
        User techLead = userRepository.findByUsername("tech_lead").orElse(null);
        Garage garage = garageRepository.findAll().stream().findFirst().orElse(null);

        if (customer == null || garage == null) {
            return;
        }

        // Quotation 1: Approved quote with active work order
        Quotation q1 = new Quotation();
        q1.setQuotationNumber("VT-QTE-2026-089");
        q1.setCustomer(customer);
        q1.setCarModel("Porsche 911 Carrera (991)");
        q1.setCustomerName(customer.getFullName());
        q1.setCustomerPhone(customer.getPhone());
        q1.setGarage(garage);
        q1.setGarageName(garage.getGarageName());
        q1.setPartsTotal(345000000L);
        q1.setLaborTotal(15000000L);
        q1.setDiscountAmount(20000000L);
        q1.setTaxAmount(0L);
        q1.setFinalTotal(340000000L);
        q1.setStatus("APPROVED");
        q1.setLegalStatus("PASS");
        q1.setNotes("High-downforce aero pack + BBS LM Forged wheels & Akrapovič Evolution Line exhaust");

        List<QuotationItem> q1Items = new ArrayList<>();
        QuotationItem item1 = new QuotationItem(null, q1, null, "BBS LM Forged Monoblock 20\" (Set of 4)", "BBS-FIR-992-TITAN", "Wheels", 1, 185000000L, 185000000L);
        QuotationItem item2 = new QuotationItem(null, q1, null, "Akrapovič Evolution Line Titanium Exhaust", "AKR-EVO-TITAN-992", "Exhaust", 1, 160000000L, 160000000L);
        q1Items.add(item1);
        q1Items.add(item2);
        q1.setItems(q1Items);

        Quotation savedQ1 = quotationRepository.save(q1);

        // WorkOrder 1: Dispatched from approved Quotation 1
        WorkOrder wo1 = new WorkOrder();
        wo1.setWorkOrderNumber("WO-2026-001");
        wo1.setQuotation(savedQ1);
        wo1.setCustomer(customer);
        wo1.setTechnician(techLead);
        wo1.setVehicleModel("Porsche 911 Carrera (991)");
        wo1.setGarage(garage);
        wo1.setBayNumber("Bay 02 - Dyno & Performance Alignment");
        wo1.setStatus("IN_PROGRESS");
        wo1.setProgress(65);
        wo1.setPriority("HIGH");
        wo1.setNotes("BBS wheel balance & fitment inspection completed. Akrapovič titanium exhaust fitment in progress on lift 2.");
        wo1.setStartedAt(LocalDateTime.now().minusHours(4));
        workOrderRepository.save(wo1);

        // Quotation 2: Pending Sent quotation
        Quotation q2 = new Quotation();
        q2.setQuotationNumber("VT-QTE-2026-092");
        q2.setCustomer(customer);
        q2.setCarModel("Ferrari 458 Spider");
        q2.setCustomerName(customer.getFullName());
        q2.setCustomerPhone(customer.getPhone());
        q2.setGarage(garage);
        q2.setGarageName(garage.getGarageName());
        q2.setPartsTotal(145000000L);
        q2.setLaborTotal(10000000L);
        q2.setDiscountAmount(5000000L);
        q2.setTaxAmount(0L);
        q2.setFinalTotal(150000000L);
        q2.setStatus("SENT");
        q2.setLegalStatus("PASS");
        q2.setNotes("Brembo GT Big Brake Kit conversion package with 6-piston monobloc calipers");

        List<QuotationItem> q2Items = new ArrayList<>();
        QuotationItem item3 = new QuotationItem(null, q2, null, "Brembo GT 6-Piston BBK Monobloc Front Kit", "BRM-1N1.9042A2", "Brakes", 1, 145000000L, 145000000L);
        q2Items.add(item3);
        q2.setItems(q2Items);

        quotationRepository.save(q2);
    }
}

