var fs = require('fs')
var data = require('./2016')

var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

var outputMD = [`| Week | ${weekDays[0]} | ${weekDays[1]} | ${weekDays[2]} | ${weekDays[3]} | ${weekDays[4]} | ${weekDays[5]} | ${weekDays[6]} |
| ---- | --- | --- | --- | --- | --- | --- | --- |`]

data.forEach(function(perWeek) {
  var maxExercisesCount = perWeek.dates.reduce(function(count, dateLog) {
    return count > dateLog.exercises.length ? count : dateLog.exercises.length
  }, 0)

  var logs = []
  for (var i = 0; i < maxExercisesCount; i++) {
    var week = i === 0 ? perWeek.startDateOfWeek : '-'

    var dayLogs = weekDays.map(function(day) {
      for (var j = 0; j < perWeek.dates.length; j++) {
        var log = perWeek.dates[j];

        if (log.day === day) {
          var exercise = log.exercises[i]

          if (!exercise) {
            return '-'
          }

          return `${exercise.name}: ${exercise.times}`
        }
      }

      return '-'
    })

    var dayMD = `| ${week} | ${dayLogs[0]} | ${dayLogs[1]} | ${dayLogs[2]} | ${dayLogs[3]} | ${dayLogs[4]} | ${dayLogs[5]} | ${dayLogs[6]} |`
    logs.push(dayMD)
  }

  outputMD.push(logs.join('\n'))
})

outputMD.push(`| xx-xx | 俯1: 2x | 桥2: 2x | 俯1: 2x | - | 腿1: 2x | 桥2: 2x | 腿1: 2x |
| - | 蹲1: 2x | - | 蹲1: 2x | - | 引2: 2x | - | 引2: 2x |`)

fs.writeFileSync('./2016.md', outputMD.join('\n'))
