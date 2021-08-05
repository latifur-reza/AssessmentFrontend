import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from '../services/building.service';
import { DataFieldService } from '../services/data-field.service';
import { ObjectService } from '../services/object.service';
import { ReadingService } from '../services/reading.service';
import * as Chart from 'chart.js'
import * as moment from "moment";
import { Moment } from 'moment';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  dateRange: {start: Moment, end: Moment};
  
  today = new Date();

  buildings : Array<any>;
  objects : Array<any>;
  dataFields : Array<any>;

  searchForm: FormGroup;

  xAxisData = [];
  yAxisData = [];
  
  canvas: any;
  ctx: any;
  myChart : any;

  constructor(private _buildingService: BuildingService,
              private _objectService: ObjectService,
              private _dataFieldService: DataFieldService,
              private _readingService: ReadingService)
              {
                
              }

  ngOnInit(): void {
    this.setForm();
    this.getBuildings();
    this.getObjects();
    this.getDataFields();
  }

  ngAfterViewInit(){
    this.loadChart();
  }

  loadChart(){
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
          labels: this.xAxisData,
          datasets:[
            {
              
              data: this.yAxisData,
              borderColor: "#00FF00",
              fill: false
            }
          ]
      },
      options: {
          legend:{
            display: false
          },
          scales: {
              xAxes:[{
                display: true,
                type: 'time',
              }],
              yAxes:[{
                display: true,
                ticks: {
                  beginAtZero: true
                }
              }]
          }
      }
    });
  }

  getBuildings(){
    this._buildingService.getBuildings().subscribe(response => {
      this.buildings = response;
    });
  }

  getObjects(){
    this._objectService.getObjects().subscribe(response => {
      this.objects = response;
    });
  }

  getDataFields(){
    this._dataFieldService.getDataFields().subscribe(response => {
      this.dataFields = response;
    });
  }

  getReadings(data : any){
    this.xAxisData = [];
    this.yAxisData = [];
    this._readingService.getReadings(data).subscribe(response => {
      this.xAxisData = response.map(response => response.timestamp);
      this.yAxisData = response.map(response => response.value);
      this.loadChart();
    });
  }

  //Set form

  setForm(){
    this.searchForm = new FormGroup({
      BuildingId: new FormControl("", [Validators.required]),
      ObjectId: new FormControl("", [Validators.required]),
      DataFieldId : new FormControl("", [Validators.required]),
      DateRangePick : new FormControl(),
    });
  }

  searchNow(){
    if(this.searchForm.valid){
      let data = {
        BuildingId: this.searchForm.value["BuildingId"],
        ObjectId: this.searchForm.value["ObjectId"],
        DataFieldId: this.searchForm.value["DataFieldId"],
        StartTimestamp: this.getDateFormat(this.dateRange.start.toDate()),
        EndTimestamp: this.getDateFormat(this.dateRange.end.toDate()),
      };

      this.getReadings(data);
    }
  }

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  getDateFormat(givenDate){
    var y = givenDate.getFullYear().toString();
    var M = (givenDate.getMonth() + 1).toString();
    var d = givenDate.getDate().toString();
    var h = givenDate.getHours() < 10 ? "0"+givenDate.getHours().toString() : givenDate.getHours().toString();
    var m = givenDate.getMinutes() < 10 ? "0"+givenDate.getMinutes().toString() : givenDate.getMinutes().toString();
    return y+"-"+M+"-"+d+"T"+h+":"+m+":00";
  }

}
