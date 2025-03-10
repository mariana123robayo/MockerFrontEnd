import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input()
  title: string = 'Busqueda de elementos';

  @Output()
  public newSearch: EventEmitter<string> = new EventEmitter();

  sendSearchInput(input: HTMLInputElement) {
    this.newSearch.emit(input.value);
  }
}
