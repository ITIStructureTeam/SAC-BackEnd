using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    public class LoadPatternDetails
    {
        public string Name { get; set; }
        public int Type { get; set; }
        public double SelfWtMult { get; set; }
    }
}
