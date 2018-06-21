import { Injectable } from '@angular/core';

declare let gtag: Function;

interface Config {
  page_title?: string;
  page_location?: string;
  page_path?: string;
}

interface ExceptionParameters {
  description: string;
  fatal: boolean;
}

interface TimingParameters {
  name: string;
  value: number;
  eventCategory?: string;
  eventLabel?: string;
}

@Injectable()
export class DataLayerService {
  constructor() {
    gtag('js', new Date());
  }

  public pushTimingComplete(timingParameters: TimingParameters) {
    gtag('event', 'timing_complete', {
      name: timingParameters.name,
      value: timingParameters.value,
      event_category: timingParameters.eventCategory || '',
      event_label: timingParameters.eventLabel || '',
    });
  }

  public pushException(exceptionParameters: ExceptionParameters) {
    console.log('exceptionParameters', exceptionParameters);
    gtag('event', 'exception', {
      description: exceptionParameters.description,
      fatal: exceptionParameters.fatal,
    });
  }

  public pushConfig(config: Config) {
    gtag('config', 'UA-120784685-1', config);
  }

  public pushPagePath(pagePath: string) {
    this.pushConfig({page_path: pagePath});
  }

  public pushPage() {
    const config = {
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname + location.search,
    };

    this.pushConfig(config);
  }

  pushTimingCompleteHttp(name: string, time: number) {
    this.pushTimingComplete({
      name: name,
      value: new Date().getTime() - time,
      eventCategory: 'http',
    });
  }

  public pushTimingCompleteLoad() {
    this.pushTimingComplete({
      name: 'load',
      value: performance.now(),
      eventCategory: 'app',
      eventLabel: window.location.hostname,
    });
  }
}
