using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //SapDeformationFrame
    public class SapDeformationFrame
    {
        public string caseID { get; set; }
        public List<SapDeformationDetails> PointsDeformationDetails { get; set; }

        public SapDeformationFrame()
        {
            PointsDeformationDetails = new List<SapDeformationDetails>();
        }
    }
}
