import { Component, inject, ChangeDetectorRef } from '@angular/core'; // 1. ChangeDetectorRef import karein
import * as XLSX from 'xlsx';
import { ProductService } from '../product.service'; 
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulkupload',
 standalone: true,
  imports: [CommonModule],
  templateUrl: './bulkupload.component.html',
  styleUrls: ['./bulkupload.component.css']
})
export class BulkuploadComponent {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef); // 2. CDR inject karein
  
  excelData: any[] = [];

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        this.excelData = jsonData; 
        console.log('File Loaded Successfully:', this.excelData);
        
        // 3. Sabse important: Angular ko forcefully UI update karne ko kahein
        this.cdr.detectChanges(); 
      } else {
        Swal.fire('Empty File', 'Excel file mein koi data nahi mila!', 'warning');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  confirmUpload() {
    if (this.excelData.length === 0) return;

    this.productService.bulkAddProducts(this.excelData).subscribe(success => {
      if (success) {
        Swal.fire({
          title: 'Success!',
          text: `${this.excelData.length} Products added to Shoes Hub inventory.`,
          icon: 'success',
          confirmButtonColor: '#1e3a8a'
        });
        this.excelData = []; 
        this.cdr.detectChanges(); 
      }
    });
  }
}