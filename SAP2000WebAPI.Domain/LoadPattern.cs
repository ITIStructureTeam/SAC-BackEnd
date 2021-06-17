using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SAP2000WebAPI.Domain
{
    public class LoadPattern
    {
        public string PatternID { get; set; }
        public LoadPatternDetails Details { get; set; }
    }
}
