import { Component, inject, OnInit } from '@angular/core';
import { ConsoleComponent } from '../../components/console/console.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulationService } from '../../../simulation/services/simulation.service';
import { switchMap } from 'rxjs';
import { Simulation } from '../../../simulation/interfaces/simulation.interface';
import { ContentDialogComponent } from '../../../simulation/components/content-dialog/content-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [ConsoleComponent, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  public simulation?: Simulation;
  readonly dialog = inject(MatDialog);

  constructor(
    private activatedRoute: ActivatedRoute,
    private simulationService: SimulationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.simulationService.getSimulationById(id)))
      .subscribe((simulation) => {
        if (!simulation) return this.router.navigateByUrl('simulations');
        return (this.simulation = simulation);
      });
  }

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '350px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.simulationService.deleteSimulation(id).subscribe({
          next: () => {
            this.router.navigateByUrl('simulations');
          },
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
