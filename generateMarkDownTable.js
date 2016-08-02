var fs = require('fs')
var MarkdownIt = require('markdown-it')
var data = require('./logs')

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

outputMD.push(`| 目标 | 俯1: 3x50 | 桥2: 3x50 | 俯1: 3x50 | 桥2: 3x | 腿1: 2x25 | 桥2: 3x50 | 腿1: 2x25 |
| - | 蹲2: 3x40 | - | 蹲2: 3x40 | - | 引2: 2x20 | - | 引2: 2x20 |`)
outputMD.push(`| YYYY-MM-DD | 俯1: 2x | 桥2: 3x | 俯1: 2x | 桥2: 3x | 腿1: 2x | 桥2: 3x | 腿1: 2x |
| - | 蹲2: 3x | - | 蹲2: 3x | - | 引2: 2x | - | 引2: 2x |`)

var finalMD = outputMD.join('\n')

fs.writeFileSync('./logs.md', finalMD)

var md = new MarkdownIt()
var html = md.render(finalMD)
html = '<link href=./bootstrap.min.css rel=stylesheet><div style="margin-top: 20px"><div class="col-sm-1"></div><div class="col-sm-10">'
  + html.replace('<table', '<table class="table table-bordered table-condensed"')
  + '</div></div>'

fs.writeFileSync('./logs.html', html)
