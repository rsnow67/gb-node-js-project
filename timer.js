// Для запуска программы нужно ввести "node timer.js mm-hh-DD-MM-YYYY mm-hh-DD-MM-YYYY",
// где mm - минуты;
// hh - часы;
// DD - день;
// MM - месяц;
// YYYY - год.

// Например, node timer.js 45-19-03-12-2023 20-05-27-03-2030.

const EventEmitter = require('events');
const emitter = new EventEmitter();
const moment = require('moment');
const colors = require('colors/safe');

const regexp = /\d{2}-\d{2}-\d{2}-\d{2}-\d{4}/;

const userDate1 = moment(process.argv[2], 'mm-hh-DD-MM-YYYY');
const userDate2 = moment(process.argv[3], 'mm-hh-DD-MM-YYYY');
let flagTimer1 = true;
let flagTimer2 = true;

class Handler {
    static showTimer(timer) {
        const duration = moment.duration(timer);
        console.log(colors.green(`До указанной даты осталось: 
лет: ${duration._data.years}
месяцев: ${duration._data.months}
дней: ${duration._data.days}
часов: ${duration._data.hours}
минут: ${duration._data.minutes}
секунд: ${duration._data.seconds}`));
    }
    static stopTimer(timerNum) {
        console.log(colors.red(`Работа таймера №${timerNum} завершена.`));
    }
}

const run = async () => {
    const currentDate = moment(new Date());
    const timer1 = userDate1.diff(currentDate);
    const timer2 = userDate2.diff(currentDate);

    if (flagTimer1) {
        if (timer1 >= 1000) {
            emitter.emit('showTimer', timer1);
        } else {
            emitter.emit('stopTimer', 1);
            flagTimer1 = false;
        }
    }

    if (flagTimer2 === true) {
        if (timer2 >= 1000) {
            emitter.emit('showTimer', timer2);
        } else {
            emitter.emit('stopTimer', 2);
            flagTimer2 = false;
        }
    }

    if (!flagTimer1 && !flagTimer2) return;

    await new Promise(resolve => setTimeout(resolve, 1000));
    run();
}

emitter.on('showTimer', Handler.showTimer);
emitter.on('stopTimer', Handler.stopTimer);
emitter.on('error', (err) => {
    console.log(colors.red(err));
})

if (regexp.test(process.argv[2]) && regexp.test(process.argv[3])) {
    run();
} else {
    emitter.emit('error', 'Вы ввели дату и время в неправильном формате.');
}