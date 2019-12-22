'use strict'

const rp = require('request-promise');
const _ = require('lodash');
// const tokenJson = require('./token');
const cmd = require('node-cmd');
const Promise = require('bluebird');
const cmdAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });
const token = 'PASTE YOUR TOKEN KEY';


// CODE TO CLONE REPOS GROUP WiSE

// (async () => {
//
//   let groups = await rp.get('https://www.gitlab.com/api/v4/groups?per_page=999', {
//     json: true,
//     qs: {
//       simple: true,
//     },
//     headers: {
//       'PRIVATE-TOKEN': token
//     }
//   })
//   console.log(`Got groups:\n`, groups.map(g => g.name))
//   let gids = _.map(groups, 'id')
//   let pgits = []
//   for (let gid of gids) {
//     let projects = await rp.get(`https://www.gitlab.com/api/v4/groups/${gid}/projects?per_page=999`, {
//       json: true,
//       qs: {
//         simple: true,
//       },
//       headers: {
//         'PRIVATE-TOKEN': token
//       }
//     })
//     let ps = _.map(projects, 'http_url_to_repo')
//     for (let p of ps) {
//       let x = p.replace('https://','https://oauth2:'+token+'@')
//       console.log(`Got project ${x} of ${gid}`)
//       pgits.push(x)
//     }
//   }
//
//   console.log("Backing up following repos")
//   console.log(pgits)
//
//   for (let git of pgits) {
//     const repoName = git.substring(19, git.length - 4)
//     console.log(`Cloning ${repoName}`)
//     await cmdAsync(`git clone ${git} backup/${repoName}`)
//     await cmdAsync(`cd backup/${repoName}`)
//     await cmdAsync(`git fetch --all`)
//     await cmdAsync(`git pull --all`)
//     await cmdAsync(`git fetch --all`)
//   }
// })()

// CODE TO CLONE REPOS YOU ARE MEMBER OF

(async () => {

  let groups = await rp.get('https://www.gitlab.com/api/v4/users/{PASTE YOUR PROFILE ID}/projects?per_page=9999&membership=true&owned=true', {
    json: true,
    qs: {
      simple: true,
    },
    headers: {
      'PRIVATE-TOKEN': token
    }
  })

  console.log('users----->',groups)
  console.log(`Got groups:\n`, groups.map(g => g.name))
  let gids = _.map(groups, 'id')
  let pgits = []
  for (let gid of gids) {

    console.log('projects--------->',groups)
    let ps = _.map(groups, 'http_url_to_repo')
    for (let p of ps) {
      let x = p.replace('https://','https://oauth2:'+token+'@')
      console.log(`Got project ${x} of ${gid}`)
      pgits.push(x)
    }
  }

  console.log("Backing up following repos")
  console.log(pgits)

  for (let git of pgits) {
    const repoName = git.substring(19, git.length - 4)
    console.log(`Cloning ${repoName}`)
    try {
      await cmdAsync(`git clone ${git} backup/${repoName}`)
      await cmdAsync(`cd backup/${repoName}`)
      await cmdAsync(`git fetch --all`)
      await cmdAsync(`git pull --all`)
      await cmdAsync(`cd ..`)
      await cmdAsync(`cd ..`)
    }
    catch (e) {
      console.log('error',e)
    }

  }
})()