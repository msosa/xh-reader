import {Component, OnInit} from '@angular/core';
import {FileSaverService} from 'ngx-filesaver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-reader',
  templateUrl: './file-reader.component.html',
  styleUrls: ['./file-reader.component.scss']
})
export class FileReaderComponent implements OnInit {

  constructor(private fileSaver: FileSaverService) {
  }

  ngOnInit(): void {
  }

  onFileChange(ev): void {
    let workBook = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      const jsonSheet = XLSX.utils.sheet_to_json(sheet, {header: 1});
      console.log(jsonSheet);
      const readers: Reader = {};
      jsonSheet.forEach(row => {
        const book = new Book(row[0], row[1], row[2]);
        (row as []).forEach((col: string, i) => {
          if (i > 2) {
            if (readers[col]) {
              readers[col].push(book);
            } else {
              readers[col] = [book];
            }
          }
        });
      });
      this.writeToFile(readers);
      // const dataString = JSON.stringify(jsonData);
      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat('...');
      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
  }

  writeToFile(readers: Reader): void {
    const aoa = [];
    Object.entries(readers).forEach(([key, value]) => {
      aoa.push([key]);
      value.forEach(book => {
        aoa.push([`  ${book.name}`, book.year, book.amount]);
      });
    });
    const wb = XLSX.utils.book_new();
    wb.SheetNames.push('Sheet1');
    wb.Sheets.Sheet1 = XLSX.utils.aoa_to_sheet(aoa);
    console.log(aoa);
    const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
    const blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
    this.fileSaver.save(blob, 'test.xlsx');
  }

}

function s2ab(s): ArrayBuffer {
  const buf = new ArrayBuffer(s.length); // convert s to arrayBuffer
  const view = new Uint8Array(buf);  // create uint8array as viewer
  for (let i = 0; i < s.length; i++) {
    // tslint:disable-next-line:no-bitwise
    view[i] = s.charCodeAt(i) & 0xFF;
  } // convert to octet
  return buf;
}

interface Reader {
  [key: string]: Book[];
}

class Book {
  constructor(name, year, amount) {
    this.name = name;
    this.year = year;
    this.amount = amount;
  }

  name: string;
  year: number;
  amount: number;
}
