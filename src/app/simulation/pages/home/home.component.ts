import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { TableComponent } from '../../components/table/table.component';
import { SimulationService } from '../../services/simulation.service';
import { Simulation } from '../../interfaces/simulation.interface';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [SearchComponent, TableComponent, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public simulations: Simulation[] = [];
  private simulationSubscription: Subscription = new Subscription();
  public loading: boolean = true;

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.simulationSubscription.add(
      this.simulationService.getSimulations().subscribe((data) => {
        this.simulations = data;
        this.loading = false;
      })
    );
  }

  filterSimulations(value: string) {
    if (value.length === 0) {
      this.simulations = this.simulationService.copySimulations;
    } else {
      this.simulations = this.simulationService.copySimulations.filter(
        (simulation) => simulation.name.includes(value)
      );
    }
  }
}
