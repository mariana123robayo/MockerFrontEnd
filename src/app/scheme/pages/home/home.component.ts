import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { TableComponent } from '../../components/table/table.component';
import { SchemaService } from '../../services/schema.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SchemaShort } from '../../interfaces/schema-short.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    ButtonComponent,
    SearchComponent,
    TableComponent,
    MatSnackBarModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public schemas: SchemaShort[] = [];
  private schemasSubcription: Subscription = new Subscription();
  public loading: boolean = true;

  constructor(
    private schemaService: SchemaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.schemasSubcription.add(
      this.schemaService.getSchemas().subscribe((data) => {
        this.schemas = data;
        this.loading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.schemasSubcription.unsubscribe();
  }

  createSchema(file: File) {
    this.schemaService.createSchema(file).subscribe({
      next: () => {
        this.snackBar.open('Esquema creado correctamente.', 'Cerrar', {
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
  }

  filterSchemas(value: string) {
    if (value.length === 0) {
      this.schemas = this.schemaService.copySchemas;
    } else {
      this.schemas = this.schemaService.copySchemas.filter((schema) =>
        schema.name.includes(value)
      );
    }
  }
}
