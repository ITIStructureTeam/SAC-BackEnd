using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    public class SapReactions
    {
        public string JointID { get; set; }
        public string PatternID { get; set; }
        public double[] Position { get; set; }
        public double[] Rx { get; set; }
        public double[] Ry { get; set; }
        public double[] Rz { get; set; }
        public double[] Mx { get; set; }
        public double[] My { get; set; }
        public double[] Mz { get; set; }
    }
}
