package org.jojo.toxictimer.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;

public class Runner {

	private int id;
	private String name;
	private String status;
	private ArrayList<Long> splits;

	public Runner(int pId, String pName, String pStatus, ArrayList<Long> pSplits) {
		this.id = pId;
		this.name = pName;
		this.status = pStatus;
		this.splits = pSplits;
	}

	public String getStatus() {
		return status;
	}
	
	public int getId() {
		return id;
	}

	/**
	 * Return the runner with the given id.
	 * 
	 * @param pRunnerId
	 *            The id of the runner.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return The runner with the right id.
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 *             Is thrown if there is no runner with the given id.
	 */
	public static Runner GetRunner(int pRunnerId, Connection pSqlConnection)
			throws SQLException, RunnerNotFoundException {
		Runner runner = null;

		Statement runnerStatement = pSqlConnection.createStatement();
		ResultSet runnerResult = runnerStatement
				.executeQuery("SELECT * FROM database.Runner WHERE idRunner='"
						+ pRunnerId + "'");
		if (runnerResult.next()) {
			runner = new Runner(runnerResult.getInt("idRunner"),
					runnerResult.getString("name"),
					runnerResult.getString("status"),
					Split.ParseSplits(runnerResult.getString("splits")));
		} else {
			throw new RunnerNotFoundException(pRunnerId);
		}

		return runner;
	}

	/**
	 * Returns the runner with the given code.
	 * 
	 * @param pRunnerCode
	 *            The code of the runner.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return The runner with the given code.
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 *             Is thrown if there is no runner with the given code.
	 */
	public static Runner GetRunner(String pRunnerCode, Connection pSqlConnection)
			throws SQLException, RunnerNotFoundException {
		Runner runner = null;

		Statement runnerStatement = pSqlConnection.createStatement();
		ResultSet runnerResult = runnerStatement
				.executeQuery("SELECT * FROM database.Runner WHERE code='"
						+ pRunnerCode + "'");
		if (runnerResult.next()) {
			runner = new Runner(runnerResult.getInt("idRunner"),
					runnerResult.getString("name"),
					runnerResult.getString("status"),
					Split.ParseSplits(runnerResult.getString("splits")));
		} else {
			throw new RunnerNotFoundException(pRunnerCode);
		}

		return runner;
	}

	/**
	 * Returns an ArrayList containing the runners of the specified race.
	 * 
	 * @param pRaceId
	 *            The id of the race the runners should be loaded from.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 */
	public static ArrayList<Runner> GetRunnerFromRace(int pRaceId,
			Connection pSqlConnection) throws SQLException,
			RunnerNotFoundException {
		ArrayList<Runner> runner = new ArrayList<Runner>();

		Statement runnerStatement = pSqlConnection.createStatement();
		ResultSet runnerResult = runnerStatement
				.executeQuery("SELECT * FROM database.Runner WHERE idRace='"
						+ pRaceId + "'");

		while (runnerResult.next()) {
			Runner singleRunner = Runner.GetRunner(
					runnerResult.getInt("idRunner"), pSqlConnection);

			runner.add(singleRunner);
		}

		return runner;
	}

	/**
	 * Joins a player into a race.
	 * 
	 * @param pName
	 *            The name of the player.
	 * @param pRaceId
	 *            The id of the race the player should join.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 * @throws RaceNotFoundExcpetion
	 *             Is thrown if there is no race with the given id.
	 */
	public static String JoinRace(String pName, int pRaceId,
			Connection pSqlConnection) throws SQLException,
			RunnerNotFoundException, RaceNotFoundExcpetion {
		int code = (int) (pName.hashCode() * (Math.random()));

		int splitCount = Split.GetSplits(
				Race.GetRace(pRaceId, pSqlConnection).getRunId(),
				pSqlConnection).size();

		String splits = "";
		for (int i = 0; i < splitCount; i++) {
			splits += "-1;";
		}

		Statement raceStatement = pSqlConnection.createStatement();
		raceStatement
				.executeUpdate("INSERT INTO `database`.`runner` (`idRace`, `code`, `name`,`splits`,`status`) VALUES ('"
						+ pRaceId
						+ "', '"
						+ code
						+ "', '"
						+ pName
						+ "','"
						+ splits + "','hold')");

		return String.valueOf(code);
	}

	/**
	 * Checks if the given name is still available.
	 * 
	 * @param pName
	 *            The name to be checked.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return True if the name is still available and false if not.
	 * @throws SQLException
	 */
	public static boolean NameAvailable(String pName, Connection pSqlConnection)
			throws SQLException {
		Statement runnerStatement = pSqlConnection.createStatement();
		ResultSet runnerResult = runnerStatement
				.executeQuery("SELECT * FROM database.Runner WHERE name='"
						+ pName + "'");

		if (runnerResult.next()) {
			return false;
		}

		return true;
	}

}
