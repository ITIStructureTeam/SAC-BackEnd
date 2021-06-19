using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    //Point
    public class Point
    {
        public int label { get; set; }
        public double[] position { get; set; }
        public bool[] Restraints { get; set; }             
    }
}
