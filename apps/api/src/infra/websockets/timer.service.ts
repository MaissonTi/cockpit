import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TimerService {
  private timers: Map<string, number> = new Map();

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  startTimer(
    key: string,
    duration: number,
    onUpdate: (remainingTime: number) => void,
    onFinish: () => void,
  ): void {
    // if (this.timers.has(key)) {
    //   throw new Error('Cronômetro já está ativo.');
    // }

    let remainingTime = duration;

    const interval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(interval);
        this.schedulerRegistry.deleteInterval(key);
        this.timers.delete(key);
        onFinish();
      } else {
        remainingTime--;
        this.timers.set(key, remainingTime);
        onUpdate(remainingTime);
      }
    }, 1000);

    this.schedulerRegistry.addInterval(key, interval);
    this.timers.set(key, duration);
  }

  pauseTimer(key: string): number {
    if (!this.timers.has(key)) {
      throw new Error('TimerService is not active.');
    }

    this.schedulerRegistry.deleteInterval(key);
    return this.timers.get(key);
  }

  resumeTimer(
    key: string,
    onUpdate: (remainingTime: number) => void,
    onFinish: () => void,
  ): void {
    const remainingTime = this.timers.get(key);

    if (!remainingTime) {
      throw new Error('TimerService is not active.');
    }

    this.startTimer(key, remainingTime, onUpdate, onFinish);
  }

  stopTimer(key: string): void {
    if (!this.timers.has(key)) {
      throw new Error('TimerService is not active.');
    }

    this.schedulerRegistry.deleteInterval(key);
    this.timers.delete(key);
  }

  getRemainingTime(key: string): number {
    return this.timers.get(key) || 0;
  }

  isTimerActive(key: string): boolean {
    return this.timers.has(key);
  }

  addTime(
    key: string,
    additionalSeconds: number,
    onUpdate: (remainingTime: number, moreTime?: boolean) => void,
    onFinish: () => void,
  ): void {
    if (!this.timers.has(key)) {
      throw new Error('TimerService is not active.');
    }

    let remainingTime = this.timers.get(key) + additionalSeconds;
    this.timers.set(key, remainingTime);

    onUpdate(remainingTime, true);

    this.schedulerRegistry.deleteInterval(key);

    const interval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(interval);
        this.schedulerRegistry.deleteInterval(key);
        this.timers.delete(key);
        onFinish();
      } else {
        remainingTime--;
        this.timers.set(key, remainingTime);
        onUpdate(remainingTime, false);
      }
    }, 1000);

    this.schedulerRegistry.addInterval(key, interval);
  }
}
