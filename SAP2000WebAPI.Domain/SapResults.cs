using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //SapResults
    public class SapResults
    {
        public List<SapStrainingActions> StrainingActions { get; set; }
        public List<SapDeformation> Deformations { get; set; }  
        public List<SapReactions> Reactions { get; set; }

        public SapResults()
        {
            StrainingActions = new List<SapStrainingActions>();
            Deformations = new List<SapDeformation>();
            Reactions = new List<SapReactions>();
        }
    }
}
