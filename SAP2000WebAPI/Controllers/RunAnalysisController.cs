using Microsoft.AspNetCore.Mvc;
using SAP2000WebAPI.Domain;
using SAP2000WebAPI.Application.ManageModel;
using System;
using System.Collections.Generic;

namespace SAP2000WebAPI.Controllers
{    
    [ApiController]
    [Route("api/[Controller]")]
    public class RunAnalysisController : ControllerBase
    {        
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

        [HttpGet("CheckModelName")]
        public IActionResult CheckModelName(string ProjectName)
        {
            try
            {
                bool Response_ = ManageModel.CheckModelName(ProjectName);
                return Ok(Response_);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetProjectsName")]
        public IActionResult GetProjectsName()
        {
            try
            {
                List<string> ProjectsNames = ManageModel.GetProjectsNames();
                return Ok(ProjectsNames);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ImportProject")]
        public IActionResult ImportProject(string ProjetName)
        {
            try
            {
                string ProjectData = ManageModel.ImportProject(ProjetName);
                return Ok(ProjectData);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
