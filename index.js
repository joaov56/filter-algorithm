'use strict';

const express = require('express');
const app = express();
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.

const candidates = []

app.post('/candidates', function(req, res) {
  const candidate = req.body
  if(!candidate){
    res.status(400).send('No candidate provided')
  }
  candidates.push(candidate)
  return res.status(200).json(candidate);
});

app.get('/candidates/search', function(req, res) {
  const skills = req.query.skills.split(',');
  if(skills.length === 0 || !candidates) {
    return res.status(400).send('No skills provided or no candidates');
  }
  const filterCandidates = [];
  skills.map(skill => {
    candidates.map(candidate => {
      if (candidate.skills.includes(skill) && !filterCandidates.includes(candidate)) {
        candidate.matchSkills =  candidate.skills.filter(candidateSkill => skills.includes(candidateSkill)).length;
        filterCandidates.push(candidate);
      }
    });
  })

  if(filterCandidates.length === 0) {
    return res.status(404).json({});
  }
  const largest = filterCandidates.sort((a,b)=>a.matchSkills-b.matchSkills).reverse()[0];
  if(largest.skills.length === 0) {
    return res.status(404).json({});
  }
  delete largest.matchSkills;
  return res.status(200).json(largest);
});

app.listen(process.env.HTTP_PORT || 3000);
