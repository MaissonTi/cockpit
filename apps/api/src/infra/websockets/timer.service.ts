import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TimerService {
  private timers: Map<string, number> = new Map();

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  startTimer(
    group: string,
    duration: number,
    onUpdate: (remainingTime: number) => void,
    onFinish: () => void,
  ): void {
    if (this.timers.has(group)) {
      throw new Error('Cronômetro já está ativo.');
    }

    let remainingTime = duration;

    const interval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(interval);
        this.schedulerRegistry.deleteInterval(group);
        this.timers.delete(group);
        onFinish();
      } else {
        remainingTime--;
        this.timers.set(group, remainingTime);
        onUpdate(remainingTime);
      }
    }, 1000);

    this.schedulerRegistry.addInterval(group, interval);
    this.timers.set(group, duration);
  }

  pauseTimer(group: string): number {
    if (!this.timers.has(group)) {
      throw new Error('Cronômetro não está ativo.');
    }

    this.schedulerRegistry.deleteInterval(group);
    return this.timers.get(group);
  }

  resumeTimer(
    group: string,
    onUpdate: (remainingTime: number) => void,
    onFinish: () => void,
  ): void {
    const remainingTime = this.timers.get(group);

    if (!remainingTime) {
      throw new Error('Cronômetro não está ativo.');
    }

    this.startTimer(group, remainingTime, onUpdate, onFinish);
  }

  stopTimer(group: string): void {
    if (!this.timers.has(group)) {
      throw new Error('Cronômetro não está ativo.');
    }

    this.schedulerRegistry.deleteInterval(group);
    this.timers.delete(group);
  }

  getRemainingTime(group: string): number {
    return this.timers.get(group) || 0;
  }
}
