import { Component, inject, Input } from '@angular/core';
import { Simulation } from '../../interfaces/simulation.interface';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from '../content-dialog/content-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-simulation-table',
  imports: [CommonModule, RouterModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input()
  public simulations: Simulation[] = [];
  readonly dialog = inject(MatDialog);

  constructor(private simulationService: SimulationService) {}

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '350px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.simulationService.deleteSimulation(id).subscribe({
          next: () => {},
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  stoppedSimulation(id: string) {
    this.simulationService.stoppedSimution(id).subscribe();
  }

  startSimulation(id: string) {
    this.simulationService.startSimulation(id).subscribe();
  }
}
