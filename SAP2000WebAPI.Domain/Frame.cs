using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //Frame
    public class Frame
    {
        public int Label { get; set; }
        public string Section { get; set; }
        public int StartPoint { get; set; }
        public int EndPoint { get; set; }
        public double Rotation { get; set; } 
        public List<Load> Loads { get; set; }
    }
}
