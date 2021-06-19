using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //SapStrainingActions
    public class SapStrainingActions
    {        
        public string FrameID { get; set; }
        public string PatternID { get; set; }        
        public double[] StartPoint { get; set; }
        public double[] EndPoint { get; set; }
        public double[] Stations { get; set; }
        public double[] MomentX { get; set; }
        public double[] MomentY { get; set; }
        public double[] Torsion { get; set; }
        public double[] Normal { get; set; }
        public double[] ShearX { get; set; }
        public double[] ShearY { get; set; }
        public double Rotation { get; set; }        
    }
}
