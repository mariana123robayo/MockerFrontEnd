import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { SchemaShort } from '../../interfaces/schema-short.interface';
import { ContentDialogComponent } from '../content-dialog/content-dialog.component';
import { SchemaService } from '../../services/schema.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schema-table',
  imports: [MatButtonModule, CommonModule, MatSnackBarModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input()
  public schemas: SchemaShort[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private schemaService: SchemaService,
    private snackBar: MatSnackBar
  ) {}

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '350px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.schemaService.deleteSchema(id).subscribe({
          next: () => {},
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  onFileSelected(event: Event, id: string) {
    const inputElement = event.target as HTMLInputElement;

    if (!(inputElement.files && inputElement.files.length > 0)) return;

    const file = inputElement.files[0];
    this.schemaService.createTemplate(file, id).subscribe({
      next: () => {
        this.snackBar.open('Template subido correctamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success'],
        });
      },
      error: (error) => {
        this.snackBar.open(error.error.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error'],
        });
      },
    });

    inputElement.value = '';
  }

  runningSchema(id: string) {
    this.schemaService.startSchema(id).subscribe();
  }
}
