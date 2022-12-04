import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogExampleComponent } from './dialog-example/dialog-example.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  public loading: boolean = false;
  public opened: boolean = false;
  public badge: number = 0;
  public progress: number = 0;
  public items: any[] = [
    {
      name: 'Home',
      description: 'Home page',
    },
    {
      name: 'About',
      description: 'About page',
    },
    {
      name: 'Contact',
      description: 'Contact page',
    },
  ];
  public degreNumber: number = 225;
  public linearGradient: string = `linear-gradient(${this.degreNumber}deg, #f3f3f3, #f3f3f3 50%, #fff 50%, #fff)`;
  public foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  public foodGroups: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  public selectedValue: string = 'steak-0';

  public autoCompliteOptions: string[] = ['One', 'Two', 'Three'];
  public objectAutoCompliteOptions: any[] = [
    { name: 'One', description: 'One description' },
    { name: 'Two', description: 'Two description' },
    { name: 'Three', description: 'Three description' },
  ];

  public myControl = new FormControl();
  public filterOptions?: Observable<string[]>;

  public minDate: Date = new Date();
  public maxDate: Date = new Date(2022, 11, 25);

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: any = new MatTableDataSource(ELEMENT_DATA);

  numbers: any = [];

  constructor(
    @Inject(PLATFORM_ID) private _platformid: Object,

    private cd: ChangeDetectorRef,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    if (isPlatformBrowser(this._platformid)) {
      console.log('Browser');
    }
    for (let i = 0; i < 1000; i++) {
      this.numbers.push(i);
    }
  }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.increaseProgress();
    // }, 100);
    this.loading = true;
    this.filterOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    // this.automaticalChangeDegreSpinner();
  }

  ngAfterViewInit(): void {
    // this.cd.detectChanges();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autoCompliteOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public automaticalChangeDegreSpinner(): void {
    setInterval(() => {
      this.degreNumber += 10;
      this.linearGradient = `linear-gradient(${this.degreNumber}deg, #f3f3f3, #f3f3f3 50%, #fff 50%, #fff)`;
      this.cd.detectChanges();
    }, 100);
  }

  public dateFilter = (date: Date | null): boolean => {
    const day = (date || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  public increaseBadge(): void {
    this.badge++;
  }

  public increaseProgress(): void {
    this.progress++;
  }

  public logChange(index: any): void {
    console.log(index);
  }

  public displayFunction(item: any): string {
    return item ? item.name : item;
  }

  public openSnackBar(message: string, action: string): void {
    let snackBarRef = this.snackBar.open(message, action, {
      duration: 2000,
    });
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('The snack-bar was dismissed');
    });
    snackBarRef.onAction().subscribe(() => {
      console.log('The snack-bar action was triggered!');
    });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogExampleComponent, {
      width: '550px',
      height: '550px',
      hasBackdrop: false,
      direction: 'ltr',

      data: { name: 'John', age: 30 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  public dataRowClick(row: any): void {
    console.log(row);
  }
}
