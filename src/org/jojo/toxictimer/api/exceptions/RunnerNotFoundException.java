package org.jojo.toxictimer.api.exceptions;

public class RunnerNotFoundException extends Exception {

	public RunnerNotFoundException(int pRunnerId) {
		super("There is no runner with the specified Id(" + pRunnerId
				+ ") in the database.");
	}

	public RunnerNotFoundException(String pRunnerCode) {
		super("There is no runner with the specified code(" + pRunnerCode
				+ ") in the database.");
	}
}
