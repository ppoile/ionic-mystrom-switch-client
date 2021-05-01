import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  //// Development server:
  //// - filter the 'Referer' header with Chrome's ModHeader plugin.
  //_base_url = "/api"
  //_http_options = {};
  // Development server:
  _base_url = "http://192.168.0.50"
  //_http_options = {headers: {}};
  //_http_headers = new HttpHeaders().set('Referrer-Policy', 'no-referrer');
  //_http_headers = new HttpHeaders().set('Accept', '*/*');
  //_http_headers = new HttpHeaders();
  //_http_options = {headers: this._http_headers};
  _http_options = {headers: {}};

  version: string;
  power: number;
  ws: number;
  relay: boolean;
  temperature: number;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getVersion();
    this.onGetReport();
  }

  public onGetReport(): void {
    console.log("onGetReport()...");
    this.http.get(this.getFullUrl('/report'), this._http_options).subscribe(
      response => {
        console.log('response:', response);
        this.power = response['power'];
        this.ws = response['Ws'];
        this.updateRelayStatus(response['relay']);
        this.temperature = response['temperature'];
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  public onSwitchOn(): void {
    console.log("onSwitchOn()...");
    this.http.get(this.getFullUrl('/relay?state=1'), this._http_options).subscribe(
      (response) => {
        this.updateRelayStatus(true);
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  public onSwitchOff(): void {
    console.log("onSwitchOff()...");
    this.http.get(this.getFullUrl('/relay?state=0'), this._http_options).subscribe(
      (response) => {
        this.updateRelayStatus(false);
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  public onToggle(): void {
    console.log("onToggle()...");
    this.http.get(this.getFullUrl('/toggle'), this._http_options).subscribe(
      (response) => {
        //console.log(response);
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

  private getVersion() {
    console.log("getVersion()...");
    this.http.get(this.getFullUrl('/api/v1/info'), this._http_options).subscribe(
      (response) => {
        console.log('response:', response);
        const version = response['version']
        console.log('version:', version);
      },
      (error) => {
        console.log('error:', error.message);
      },
    );
  }

  private updateRelayStatus(new_value: boolean): void
  {
    if (new_value !== this.relay) {
      console.log('new relay status:', new_value);
      this.relay = new_value;
    }
  }

  private getFullUrl(url: string): string {
    return this._base_url + url;
  }
}
