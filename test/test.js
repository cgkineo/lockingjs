(function() {
	var catchErrors = false;
	window.unit = function(name, test, output) {
		unit.output(name);
		if (catchErrors) {
			try {
				var ret = test();
				if (ret !== undefined ) {
					unit.output("Returns: "+ret+" " + output());	
				} else unit.output(output());		
			} catch(e) {
				unit.output("Errored:");
				unit.output(e);
			}
		} else { 
			var ret = test();
			if (ret !== undefined ) {
				unit.output("Returns: "+ret+" " + output());	
			} else unit.output(output());			
		}
		unit.output("\n");
	};

	window.unit.output = function(text) {
		var ele = document.getElementsByClassName("output")[0];
		var tn = document.createTextNode(text + "\n");
		ele.appendChild(tn);
	};

	window.unit.load = function(callback) {
		window.onload = callback;
	};
})();

unit.load(function() {

	unit.output("Starting test"+"\n");

	//BATCH 1

	unit.output("\nBATCH 1: Unnamed binary lock"+"\n");
	unit.output("Each stakeholder is allowed 1 lock (using only '_default' stakeholder as unnamed)\n");

	unit(
		"//initial value", 
		function() {
			
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');		//lockValue=1
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');		//lockValue=1
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');		//lockValue=1
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');		//lockValue=1
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');		//lockValue=1
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');		//lockValue=1
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	Locking.reset('lockId1')

	//BATCH 2

	unit.output("\nBATCH 2: Named binary lock"+"\n");
	unit.output("Each stakeholder is allowed 1 lock.\n");

	unit(
		"//initial value", 
		function() {
			
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderA'); ", 
		function() {
			return Locking.lock('lockId1', 'stakeholderA'); 
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderB');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderB');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderB');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderB');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderA'); ", 
		function() {
			Locking.unlock('lockId1', 'stakeholderA'); 
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderA'); ", 
		function() {
			Locking.unlock('lockId1', 'stakeholderA'); 
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderB'); ", 
		function() {
			Locking.unlock('lockId1', 'stakeholderB'); 
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderB'); ", 
		function() {
			Locking.unlock('lockId1', 'stakeholderB'); 
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderA'); ", 
		function() {
			Locking.unlock('lockId1', 'stakeholderA'); 
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	Locking.reset('lockId1');

	//BATCH 3

	unit.output("\nBATCH 3: Unnamed resource lock"+"\n");
	unit.output("5 locks maximum, unlimited locks per stakeholder (using '_default' stakeholder only as unnamed)\n")

	unit(
		"//initial value", 
		function() {
			
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.setLockMaxValue('lockId1', 5);", 
		function() {
			Locking.setLockMaxValue('lockId1', 5);
		},
		function() {
			return "//lockMaxValue="+Locking.getLockMaxValue('lockId1');
		}
	);

	unit(
		"Locking.setLockStakeholderMaxValue('lockId1', -1);", 
		function() {
			Locking.setLockStakeholderMaxValue('lockId1', -1);
		},
		function() {
			return "//lockStakeholderMaxValue="+Locking.getLockStakeholderMaxValue('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1');", 
		function() {
			return Locking.lock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1');", 
		function() {
			Locking.unlock('lockId1');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	Locking.reset('lockId1');

	//BATCH 4

	unit.output("\nBATCH 4: Named resource lock"+"\n");
	unit.output("Each stakeholder is allowed 2 locks, with 4 locks total maximum\n");

	unit(
		"//initial value", 
		function() {
			
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.setLockMaxValue('lockId1', 4);", 
		function() {
			Locking.setLockMaxValue('lockId1', 4);
		},
		function() {
			return "//lockMaxValue="+Locking.getLockMaxValue('lockId1');
		}
	);

	unit(
		"Locking.setLockStakeholderMaxValue('lockId1', 2);", 
		function() {
			Locking.setLockStakeholderMaxValue('lockId1', 2);
		},
		function() {
			return "//lockStakeholderMaxValue="+Locking.getLockStakeholderMaxValue('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderA');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderA');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderB');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderB');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderA');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderA');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderA');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderA');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderC');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderC');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.lock('lockId1', 'stakeholderC');", 
		function() {
			return Locking.lock('lockId1', 'stakeholderC');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderA');", 
		function() {
			Locking.unlock('lockId1', 'stakeholderA');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderC');", 
		function() {
			Locking.unlock('lockId1', 'stakeholderC');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderB');", 
		function() {
			Locking.unlock('lockId1', 'stakeholderB');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderC');", 
		function() {
			Locking.unlock('lockId1', 'stakeholderC');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderB');", 
		function() {
			Locking.unlock('lockId1', 'stakeholderB');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	unit(
		"Locking.unlock('lockId1', 'stakeholderA');", 
		function() {
			Locking.unlock('lockId1', 'stakeholderA');
		},
		function() {
			return "//lockValue="+Locking.getLockValue('lockId1')+",isLocked="+Locking.isLocked('lockId1');
		}
	);

	

});
