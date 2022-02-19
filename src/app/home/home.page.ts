import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { timeout } from 'rxjs/operators';


export class MyStromSwitchStatus {
  power: number;
  ws: number;
  relay: boolean;
  temperature: number;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  _auto_refresh_subscription;
  _mystrom_switch_backend_base_url = 'http://192.168.0.30:5000/';
  switch_status: MyStromSwitchStatus = new MyStromSwitchStatus();
  error_message: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('mystrom-switch-backend-base-url:', this._mystrom_switch_backend_base_url);
    this.setupAutoRefresher();
  }

  public onGetReport(): void {
    console.log('onGetReport()...');
    const url = this.getFullMyStromClientUrl('switch-status');
    const src = this.http.get(url).pipe(timeout(1000));
    src.subscribe(
      response => {
        console.log('response:', response);
        this.error_message = '';
        this.switch_status = {
          power: response['power'],
          ws: response['Ws'],
          relay: response['relay'],
          temperature: response['temperature'],
        };
      },
      (error) => {
        console.log('error:', error);
        this.error_message = error.message;
        if (error.name === 'TimeoutError') {
          this.error_message = `No response from ${url}`;
        }
        console.log('error_message:', this.error_message);
      },
    );
  }

  public onSwitchOn(): void {
    console.log('onSwitchOn()...');
    this.http.get(this.getFullMyStromClientUrl('switch-on')).subscribe(
      (response) => {
        this.updateRelayStatus(true);
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  public onSwitchOff(): void {
    console.log('onSwitchOff()...');
    this.http.get(this.getFullMyStromClientUrl('switch-off')).subscribe(
      (response) => {
        this.updateRelayStatus(false);
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  public onToggle(): void {
    console.log('onToggle()...');
    this.http.get(this.getFullMyStromClientUrl('switch-toggle')).subscribe(
      (response) => {
        console.log(response);
        this.updateRelayStatus(response['relay']);
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  public doRefresh(event: any) {
    const refresher = event.target;
    console.log('doRefresh():', refresher);
    this.onGetReport();
    setTimeout(() => {
      refresher.complete();
    }, 1);
  }

  private setupAutoRefresher() {
    const source = timer(0, 60000);
    this._auto_refresh_subscription = source.subscribe(val => {
      console.log('auto refresh...');
      this.onGetReport();
    });
  }

  private updateRelayStatus(new_value: boolean): void {
    if (new_value !== this.switch_status.relay) {
      console.log('new relay status:', new_value);
      this.switch_status.relay = new_value;
    }
  }

  private getFullMyStromClientUrl(url: string): string {
    return this._mystrom_switch_backend_base_url + url;
  }
}
