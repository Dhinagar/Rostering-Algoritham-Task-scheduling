const { trim } = require("lodash");

const checkLeastConversation = (arra) => {
    let selectedAgent = null;
    arra.map((agent) => {
        if (agent.activeConversation && Array.isArray(agent.activeConversation)) {
            if (selectedAgent) {
                if (
                    agent.activeConversation.length <
                    selectedAgent.activeConversation.length
                ) {
                    selectedAgent = agent;
                }
            } else {
                selectedAgent = agent;
            }
        }
    });
    return selectedAgent;
};

const findAgent = (agents = [], reqobj = {}, filters = []) => {
      try {
        let availableAgents = agents;
        if (agents.length === 0) {
            return []
        }
        if (reqobj === {}) {
            //what should we do
            return availableAgents
        }
    
        for (let i = 0; i < filters.length; i++) {
            let operator = filters[i].trim().split(":");
            let command = operator[0];
            let commandData = filters[i].trim().substring(filters[i].indexOf(":") + 1);
    
            if (availableAgents.length === 0) break;
            switch (command) {
                case "eq":
                    let filterBy = commandData.split("=")
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(filterBy[0]) || agent[filterBy[0]] === filterBy[1]));
                    break;
                case "containsReq":
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || (agent[commandData].length == 0) || agent[commandData].includes(reqobj[commandData])))
                    break;
                case "containsAnyReq":
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || (agent[commandData].length == 0) || agent[commandData].some(r => reqobj[commandData].includes(r))))
                    break;
                case "containsAllReq":
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || (agent[commandData].length == 0) || agent[commandData].sort().join(',') === reqobj[commandData].sort().join(',')))
                    break;
                case "lt":
                    let filterbylt = commandData.split("=")
                    availableAgents = availableAgents.filter((agent) => (!(agent.hasOwnProperty(filterbylt[0]) && agent.hasOwnProperty(filterbylt[1])) || agent[filterbylt[0]] < filterbylt[1]))
                    break;
                case "gt":
                    let filterByGt = commandData.split("=")
                    availableAgents = availableAgents.filter((agent) => (!(agent.hasOwnProperty(filterByGt[0]) && agent.hasOwnProperty(filterByGt[1])) || agent[filterByGt[0]] > filterByGt[1]))
                    break;
                case "lte":
                    let filterByLte = commandData.split("=")
                    availableAgents = availableAgents.filter((agent) => (!(agent.hasOwnProperty(filterByLte[0]) && agent.hasOwnProperty(filterByLte[1])) || agent[filterByLte[0]] <= filterByLte[1]))
                    break;
                case "gte":
                    let filterByGte = commandData.split("=")
                    availableAgents = availableAgents.filter((agent) => (!(agent.hasOwnProperty(filterByGte[0]) && agent.hasOwnProperty(filterByGte[1])) || agent[filterByGte[0]] >= filterByGte[1]))
                    break;
                case "containsAny":
                    let filterBycontainsAnyReq = commandData.split("=")
                    let containValue = filterBycontainsAnyReq[1].split(",")
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || (agent[commandData].length == 0) || containValue.includes(agent[filterBycontainsAnyReq[0]])))
                    break;
                case "containsAll":
                    let filterBycontainsAllReq = commandData.split("=")
                    let containAllValue = filterBycontainsAllReq[1].split(",")
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || (agent[commandData].length == 0) || agent[commandData].sort().join(',') === containAllValue.sort().join(',')))
                    break;
                case "min":
                    let minvalue = availableAgents.reduce((prev, curr) => {
                        return !(prev.hasOwnProperty(commandData) && curr.hasOwnProperty(commandData)) || prev[commandData] < curr[commandData] ? prev : curr;
                    });
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || agent[commandData] === minvalue[commandData]))
                    break;
                case "max":
                    let maxvalue = availableAgents.reduce((prev, curr) => {
                        return !(prev.hasOwnProperty(commandData) && curr.hasOwnProperty(commandData)) || prev[commandData] > curr[commandData] ? prev : curr;
                    });
                    availableAgents = availableAgents.filter((agent) => (!agent.hasOwnProperty(commandData) || agent[commandData] === maxvalue[commandData]))
                    break;
                default:
                    break;
            }
        }
        return availableAgents;    
      } catch (error) {
          
          throw new Error(error)  
      }
   }
module.exports = { checkLeastConversation, findAgent };

