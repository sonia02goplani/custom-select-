import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import {
  BehaviorSubject,
  debounceTime,
  Observable,
  scan,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-custom-mat-select-not-dependent',
  templateUrl: './custom-mat-select-not-dependent.component.html',
  styleUrls: ['./custom-mat-select-not-dependent.component.css'],
})
export class CustomMatSelectNotDependentComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() placeholder = 'Select Item';
  @Input() searchPlaceHolder = 'Search Item';
  @Input() set data(value) {
    this._data = value?.slice();
    this.originalData = this._data?.slice();
    this.offset = 0;
    this.items.next([]);
    this.getNextBatch();
  }
  get data() {
    return this._data;
  }
  @Input()
  identifierName!: string;
  @Input() valueName!: string;
  // ! - aka TypeScript's "non-null assertion operator", is a way to tell typescript that you know for sure the value of a property is neither null nor undefined.
  @Input() multiple!: boolean;
  @Input() enableSelectAll: any;
  @Input() set mark(value: boolean) {
    if (value) {
      // this.markAsTouched();
    }
  }
  @Input() set disabledCondition(value: any) {
    this.setDisabledState(value);
  }
  @Input() editMode!: boolean;
  @Input() isFieldRequired!: boolean;
  _data: any[] = [];
  disabledOptions: any[] = [];
  isIndeterminate = false;
  isChecked = false;
  excludeIds: number[] = [];
  onChange: any;
  onTouched: any;
  disabled = false;
  value: any;
  items = new BehaviorSubject<any[]>([]);
  items$: Observable<any[]> | undefined;
  selectedItemControl: FormControl = new FormControl();
  searchFilterControl: FormControl = new FormControl(null);
  limit = 30;
  offset = 0;
  originalData: any[] = [];
  selectedData: any = {};
  disableOptions: any[] = [];
  _onDestroy = new Subject<void>();
  constructor(public ngControl: NgControl) {
    if (this.ngControl != null) this.ngControl.valueAccessor = this;
    this.items$ = this.items.asObservable().pipe(
      scan((acc: any[], curr: any[]) => {
        if (!acc || !curr) return [];
        return [...acc, ...curr];
      }, [])
    );
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  writeValue(obj: any): void {
    this.selectedItemControl.setValue(obj);
    this.selectedItemControl.markAsPristine();
    this.selectedItemControl.markAsUntouched();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markasTouched() {
    this.selectedItemControl.markAsTouched();
  }
  ngOnInit() {
    if (this.disabledCondition) {
      this.disabled = true;
    }

    //search
    this.searchFilterControl.valueChanges
      .pipe(takeUntil(this._onDestroy), startWith(''), debounceTime(500))
      .subscribe(() => {
        this.searchBasedFilterlist();
        if (this.multiple && this.enableSelectAll)
          this.setToggleAllCheckboxState();
      });
  }

  searchBasedFilterlist() {
    if (!this.originalData) return;
    let search = this.searchFilterControl.value
      ? this.searchFilterControl.value.trim()
      : null;
    if (!search) {
      if (Object.keys(this.selectedData)?.length > 0) {
        this._data = [
          ...Object.keys(this.selectedData)?.map((r) => this.selectedData[r]),
          ...this.originalData.filter(
            (r) => !this.excludeIds.includes(r[this.identifierName])
          ),
        ];
      } else {
        this._data = this.originalData?.slice();
      }
      this.offset = 0;
      this.items.next([]);
      this.getNextBatch();
    }
  }
  setToggleAllCheckboxState() {
    let filteredLength =0
    if(this.selectedItemControl && this.selectedItemControl.value?.length > 0){
      this._data.forEach(e1=>{
        if(Object.keys(this.selectedData)?.map(Number).indexOf(e1[this.identifierName]) > -1){
          filteredLength++;
        }

      })
    }
    this.isIndeterminate = filteredLength > 0 && filteredLength < this._data.length
    this.isChecked = filteredLength > 0 && filteredLength == this._data?.length
  }
  getNextBatch() {
    const result = this._data.slice(this.offset, this.offset + this.limit);
    this.items.next(result);
    this.offset += this.limit;
  }
  setDisabledState(value: any) {}
  onCloseSelect() {}
  toggleSelectAll(selectAllValue: boolean) {
    if (selectAllValue) {
      this._data.map((item) => {
        if (!this.disableOptions.includes(item[this.identifierName]))
          this.selectedData = Object.assign(
            this.selectedData,
            this.createObject(item)
          );
      });
      this.selectedItemControl.patchValue(
        Object.keys(this.selectedData)?.map((r) => parseInt(r)),
        {
          emitEvent: false,
          emitModelToViewChange: true,
          emitViewToModelChange: true,
        }
      );
      this.excludeIds = Object.keys(this.selectedData)?.map((r) => parseInt(r));
      this.onChange(this.selectedItemControl.value);
      this.setToggleAllCheckboxState();
    } else {
      this._data.map((item) => {
        delete this.selectedData[item[this.identifierName]];
      });
      this.selectedItemControl.patchValue(
        Object.keys(this.selectedData)?.map((r) => parseInt(r)),
        {
          emitEvent: false,
          emitModelToViewChange: true,
          emitViewToModelChange: false,
        }
      );
      this.excludeIds = Object.keys(this.selectedData)?.map((r) => parseInt(r));
      this.onChange(this.selectedItemControl.value);
      this.setToggleAllCheckboxState();
    }
  }
  createObject(item: any) {
    let object: any = {};
    object[item[this.identifierName]] = item;
    return object;
  }
  UnCheckSingleSelect(event: MatOptionSelectionChange, item: any) {
    if (!event.isUserInput) return;
    if (!this.multiple) {
      this.selectedData = {};
      this.excludeIds = [];
      this.excludeIds = [item[this.identifierName]];
      this.selectedData = Object.assign(
        this.selectedData,
        this.createObject(item)
      );
    }
  }
  UnCheckSelectAll(event: MatOptionSelectionChange, item: any) {
    if (!event.isUserInput) return;
    const state = event.source.selected;
    if (!state) {
      delete this.selectedData[item[this.identifierName]];
      this.excludeIds.splice(
        this.excludeIds?.indexOf(item[this.identifierName]),
        1
      );
    } else {
      this.excludeIds.push(item[this.identifierName]);
      this.selectedData = Object.assign(
        this.selectedData,
        this.createObject(item)
      );
    }
    this.selectedItemControl.patchValue(
      Object.keys(this.selectedData)?.map((r) => parseInt(r)),
      {
        emitEvent: false,
      }
    );
    this.onChange(this.selectedItemControl.value);
    if (this.multiple && this.enableSelectAll) this.setToggleAllCheckboxState();
  }
}
