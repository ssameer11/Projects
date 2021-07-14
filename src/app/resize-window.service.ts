import { HostListener, Injectable } from "@angular/core";
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { map, take } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { EventManager } from "@angular/platform-browser";
import { Platform } from "@angular/cdk/platform";

@Injectable()
export class ResizeWindowService {
    deviceDimensions: BehaviorSubject<{width: number,height: number}> = new BehaviorSubject(({width: window.innerWidth,height: window.innerHeight}));
    constructor(private eventManager: EventManager){
        eventManager.addGlobalEventListener('window','resize',(event => {
            this.deviceDimensions.next({width: event.target.innerWidth,height: event.target.innerHeight})
        }))
    }

    
}