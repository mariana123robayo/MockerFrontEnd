import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input()
  public title = 'Titulo de botón';

  @Input()
  public type = 'button';

  @Output()
  public newFile: EventEmitter<File> = new EventEmitter();

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!(inputElement.files && inputElement.files.length > 0)) return;

    const file = inputElement.files[0];
    this.newFile.emit(file);

    inputElement.value = '';
  }
}
