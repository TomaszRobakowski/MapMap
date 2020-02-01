import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

import { RestService } from '../rest.service';
@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.html',

})

export class TestMapComponent implements OnInit {

  chargeLevelList = [
    { value: 0, label: ': all' },
    { value: 10, label: ' > 10%' },
    { value: 30, label: ' > 30%' },
    { value: 50, label: ' > 50%' },
    { value: 70, label: ' > 70%' },
    { value: 90, label: ' > 90%' }
  ];
  chargeLevel = 0;

  availabilityList = [
    { value: 'ALL', label: ': all'},
    { value: 'AVAILABLE', label: ': available'},
    { value: 'UNAVAILABLE', label: ': unavailable'}
  ];
  vehicleAvailability = 0;
  parkingAvailability = 0;

  innerHeight: any;
  sizeChanger = 120;
  selectedMarker: any;
  markers = new Array() ;
  center: any;
  closeResult: string;
  obj = {
    cars: true,
    pois: false,
    parkings: false
  };

  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  infoContent = '';
  openInfo(marker: MapMarker, content) {
    this.infoContent = content;
    this.infoWindow.open(marker);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = event.target.innerHeight - this.sizeChanger + 'px';
  }

  getScreenSize() {
    this.innerHeight = window.innerHeight - this.sizeChanger + 'px';
  }

  constructor(public rest: RestService, config: NgbModalConfig, private modalService: NgbModal) {
    this.getScreenSize();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.onParkingChange();
    this.onPoiChange();
    this.onVehicleChange();
  }

  getLotMarker(factor): string {
    // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason

    let url = '../../assets/pictures/marker1.png';
    if (factor === 1) {
      url = '../../assets/pictures/marker12.png';
    }
    return url;
  }

  getCarMarker(status: string): string {
    // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason

    let url = '../../assets/pictures/marker2.png';
    if (status === 'AVAILABLE') {
      url = '../../assets/pictures/marker22.png';
    }
    return url;
  }

  getCarPicture(color: string): string {
    // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason
    let fname = '../../assets/pictures/';
    switch (color.toLowerCase()) {
      case 'white':
        fname = fname + 'car-white.png';
        break;
      case 'blue':
        fname = fname + 'car-blue.png';
        break;
      default:
        fname = fname + 'car-blue.png';
    }
    return fname;
  }

  getBatteryIcon(percentage: number): string {
    // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason
    let fname = '../../assets/pictures/energy';
    if (percentage <= 20) {
      fname = fname + '020.png';
    } else if (percentage <= 40) {
      fname = fname + '040.png';
    } else if (percentage <= 60) {
      fname = fname + '060.png';
    } else if (percentage <= 80) {
      fname = fname + '080.png';
    } else {
      fname = fname + '100.png';
    }
    return fname;
  }

  availability(av: number, total: number): string {
    let status = 'DOSTĘPNY';
    if (av / total === 1) {
      status = 'BRAK MIEJSC';
    }
    return status;
  }

  onParkingChange() {
    if (this.obj.parkings) {
      this.displayParkings(this.availabilityList[this.parkingAvailability].value);
    } else {
      this.clearUnusedObjects('LOT');
    }
  }

  onPoiChange() {
    if (this.obj.pois) {
      this.displayPois();
    } else {
      this.clearUnusedObjects('POI');
    }
  }

  onVehicleChange() {
    if (this.obj.cars) {
      this.displayVehicles(this.chargeLevelList[this.chargeLevel].value, this.availabilityList[this.vehicleAvailability].value);
    } else {
      this.clearUnusedObjects('CAR');
    }
  }

  clearUnusedObjects(uo: string) {

  let index = this.markers.length - 1;
  while (index >= 0) {
      if (this.markers[index].type === uo) {
        this.markers.splice(index, 1);
      }

      index -= 1;
    }
  }

  onClickDD(val) {
    this.chargeLevel = val;
  }

  onClickVehicleAvailability(val) {
    this.vehicleAvailability = val;
  }

  onApplyCarClick() {
    this.clearUnusedObjects('CAR');
    this.onVehicleChange();
  }

  onClickParkingAvailability(val) {
    this.parkingAvailability = val;
  }

  onApplyLotClick() {
    this.clearUnusedObjects('LOT');
    this.onParkingChange();
  }

  displayPois() {
    this.rest.getPOIsList().subscribe ( (pois: {}) => {
      const key = 'objects';
      const poisArray = pois[key];
      poisArray.forEach(poi => {
        this.markers.push({
          show: true,
          type: 'POI',
          position: {
            lat: poi.location.latitude,
            lng: poi.location.longitude,
          },

          title:  poi.name,
          // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason
          options: { icon:  { url: '../../assets/pictures/marker3.png' }, },
          html: {
              // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason
              image: '../../assets/pictures/poi.jpg',
              bLvl: '',
              bIco: '',
              info1: poi.name,
              info2: poi.category,
              info3: '',
              info4: '',
              info5: poi.description
          }
        });
      });
    });
  }

  displayParkings(vAva) {
    this.rest.getParkingssList().subscribe ( (lots: {}) => {
      const key = 'objects';
      const lotsArray = lots[key];
      lotsArray.forEach( lot => {
      if (
          ( ( vAva === 'ALL') ||
            ( vAva === 'AVAILABLE' && lot.availableSpacesCount / lot.spacesCount < 1 ) ||
            ( vAva !== 'AVAILABLE' && lot.availableSpacesCount / lot.spacesCount === 1 )

          )
        ) {
          this.markers.push({
            show: true,
            type: 'LOT',
            position: {
              lat: lot.location.latitude,
              lng: lot.location.longitude,
            },
            title:  lot.address.street + ' ' + lot.address.house,
            options: { icon:  { url: this.getLotMarker(lot.availableSpacesCount / lot.spacesCount) }, },
            html: {
                // TODO: it is unsafe solution, necessary to change, relative path is prohibited because of security reason
                image: '../../assets/pictures/parking.jpg',
                bLvl: '',
                bIco: '',
                info1: this.availability(lot.availableSpacesCount, lot.spacesCount),
                info2: lot.availableSpacesCount  + ' / ' +  lot.spacesCount,
                info3: '',
                info4: '',
                info5: lot.discriminator + ' ' + lot.name
            }
          });
        }
      });
    });
  }

  displayVehicles(chLvl, vAva) {
    this.rest.getVehiclesList().subscribe ( (vehicles: {}) => {
      const key = 'objects';
      const vehicleArray = vehicles[key];
      let i = 0;
      vehicleArray.forEach(vehicle => {
          if (i === 0) {
            this.center = {
              lat: vehicle.location.latitude,
              lng: vehicle.location.longitude
            };
          }

          if (vehicle.batteryLevelPct > chLvl && (
              (vAva === 'ALL' || (vAva === vehicle.status))
          )) {
            i++ ;
            this.markers.push({
              type: 'CAR',
              show: true,
              position: {
                lat: vehicle.location.latitude,
                lng: vehicle.location.longitude,
              },
              title:  vehicle.platesNumber,
              options: { icon:  { url: this.getCarMarker(vehicle.status) }, },
              html: {
                image: this.getCarPicture(vehicle.color),
                bLvl: vehicle.batteryLevelPct,
                bIco: this.getBatteryIcon(vehicle.batteryLevelPct),
                info1: vehicle.status,
                info2: vehicle.sideNumber,
                info3: vehicle.rangeKm,
                info4: vehicle.color,
                info5: vehicle.platesNumber
              }
            });
          }
        });
     });
  }
}
