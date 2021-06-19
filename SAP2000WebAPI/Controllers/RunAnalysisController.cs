using Microsoft.AspNetCore.Mvc;
using SAP2000WebAPI.Domain;
using SAP2000WebAPI.Application.ManageModel;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SAP2000WebAPI.Controllers
{    
    [ApiController]
    [Route("api/[Controller]")]
    public class RunAnalysisController : ControllerBase
    {
        //Create Sap Model and return results
        [HttpPost("LoadFramesData")]
        public IActionResult LoadFrameData([FromBody]string ProjectName)
        {
            try
            {
                SapResults ModelResults = ManageModel.CreateModel(ProjectName);
                return Ok(ModelResults);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Save Sap Model in user directory
        [HttpPost("SaveModel")]
        public IActionResult SaveModelData([FromBody] RootObject ModelData)
        {            
            try
            {
                ManageModel.SaveModel(ModelData);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Validate Model Name
        [HttpPost("CheckModelName")]
        public IActionResult CheckModelName([FromBody]string ProjectName)
        {
            try
            {
                bool Response_ = ManageModel.CheckModelName(ProjectName);
                string ValidationResult = JsonConvert.SerializeObject(Response_.ToString());                
                return Ok(ValidationResult);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //get all past projects names
        [HttpGet("GetProjectsName")]
        public IActionResult GetProjectsName()
        {
            try
            {
                List<string> ProjectsNames = ManageModel.GetProjectsNames();
                string ProjectsList = JsonConvert.SerializeObject(ProjectsNames);
                return Ok(ProjectsList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //import certain project data
        [HttpPost("ImportProject")]
        public IActionResult ImportProject([FromBody]string ProjetName)
        {
            try
            {
                string ProjectData = ManageModel.ImportProject(ProjetName);
                string ModelData = JsonConvert.SerializeObject(ProjectData);
                return Ok(ModelData);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
