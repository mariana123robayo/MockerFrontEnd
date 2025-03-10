import { Injectable } from '@angular/core';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Simulation } from '../interfaces/simulation.interface';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private URL = environment.URL;
  private _refreshSimulations = new BehaviorSubject<void>(undefined);
  private _refreshSimulation = new BehaviorSubject<void>(undefined);
  public copySimulations: Simulation[] = [];

  constructor(private http: HttpClient) {}

  get refreshSimulations() {
    return this._refreshSimulations.asObservable();
  }

  get refreshSimulation() {
    return this._refreshSimulation.asObservable();
  }

  getSimulations() {
    return this._refreshSimulations.pipe(
      switchMap(() => this.http.get<Simulation[]>(`${this.URL}/simulation`)),
      map((simulations) =>
        simulations.map((simulation) => ({
          ...simulation,
          name: simulation.name.toLowerCase(),
        }))
      ),
      tap((simulations) => (this.copySimulations = [...simulations]))
    );
  }

  deleteSimulation(id: string) {
    return this.http
      .delete(`${this.URL}/simulation/${id}`)
      .pipe(tap(() => this._refreshSimulations.next()));
  }

  stoppedSimution(id: string) {
    return this.http
      .get(`${this.URL}/simulation/stop/${id}`)
      .pipe(tap(() => this._refreshSimulations.next()))
      .pipe(tap(() => this._refreshSimulation.next()));
  }

  startSimulation(id: string) {
    return this.http
      .get(`${this.URL}/simulation/start/${id}`)
      .pipe(tap(() => this._refreshSimulations.next()))
      .pipe(tap(() => this._refreshSimulation.next()));
  }

  getSimulationById(id: string) {
    return this._refreshSimulation.pipe(
      switchMap(() =>
        this.http.get<Simulation>(`${this.URL}/simulation/state/${id}`)
      ),
      map((simulation) => ({
        ...simulation,
        name: simulation.name.toLowerCase(),
      }))
    );
  }
}
