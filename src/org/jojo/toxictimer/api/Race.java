package org.jojo.toxictimer.api;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;

public class Race {

	private int id;
	private int gameId;
	private int runId;
	private long started;
	private ArrayList<Runner> runner;

	public Race(int pId, int pGameId, int pRunId, long pStarted,
			ArrayList<Runner> pRunner) {
		this.id = pId;
		this.gameId = pGameId;
		this.runId = pRunId;
		this.started = pStarted;
		this.runner = pRunner;
	}

	public int getRunId() {
		return runId;
	}

	public ArrayList<Runner> getRunner() {
		return runner;
	}

	public boolean IsRunning() {
		return started != 0;
	}

	/**
	 * Returns the race with the given id
	 * 
	 * @param pRaceId
	 *            The id of the race.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 * @throws RaceNotFoundExcpetion
	 *             Is thrown if there is no race with the given id.
	 */
	public static Race GetRace(int pRaceId, Connection pSqlConnection)
			throws SQLException, RunnerNotFoundException, RaceNotFoundExcpetion {
		Race race = null;

		Statement raceStatement = pSqlConnection.createStatement();
		ResultSet raceResult = raceStatement
				.executeQuery("SELECT * FROM database.Race WHERE idRace ='"
						+ pRaceId + "'");

		if (raceResult.next()) {
			race = new Race(pRaceId, raceResult.getInt("idGame"),
					raceResult.getInt("idRun"), raceResult.getLong("started"),
					Runner.GetRunnerFromRace(pRaceId, pSqlConnection));
		} else {
			throw new RaceNotFoundExcpetion(pRaceId);
		}
		return race;
	}

	/**
	 * Returns the amount of races.
	 * 
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @throws SQLException
	 */
	public static int GetRaceCount(Connection pSqlConnection)
			throws SQLException {
		Statement raceStatement = pSqlConnection.createStatement();
		ResultSet raceResult = raceStatement
				.executeQuery("SELECT idRace FROM database.Race");

		int raceCount = 0;
		if (raceResult.last()) {
			raceCount = raceResult.getRow();
		}

		return raceCount;
	}

	/**
	 * Returns a list of races.
	 * 
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return An ArrayList containing the races.
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 * @throws RaceNotFoundExcpetion
	 */
	public static ArrayList<Race> GetRaceList(Connection pSqlConnection)
			throws SQLException, RunnerNotFoundException, RaceNotFoundExcpetion {
		Statement raceListStatement = pSqlConnection.createStatement();
		ResultSet raceListResult = raceListStatement
				.executeQuery("SELECT * FROM database.Race");

		ArrayList<Race> races = new ArrayList<Race>();

		while (raceListResult.next()) {

			races.add(Race.GetRace(raceListResult.getInt("idRace"),
					pSqlConnection));
		}
		return races;
	}

	/**
	 * Updates the state of the race. If all players are ready the race will be
	 * started.
	 * 
	 * @param pRaceId
	 *            The id of the race to be updated.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @throws SQLException
	 * @throws RunnerNotFoundException
	 * @throws RaceNotFoundExcpetion
	 *             Is thrown if there is no race with the given id.
	 */
	public static void Update(int pRaceId, Connection pSqlConnection)
			throws SQLException, RunnerNotFoundException, RaceNotFoundExcpetion {
		Race race = Race.GetRace(pRaceId, pSqlConnection);

		boolean start = true;

		for (int i = 0; i < race.getRunner().size(); i++) {
			if (race.getRunner().get(i).getStatus().equals("hold")) {
				start = false;
			}
		}

		if (start) {
			java.util.Date date = new java.util.Date();
			System.out.println(date.getTime());

			Statement raceStatement = pSqlConnection.createStatement();
			raceStatement
					.executeUpdate("UPDATE `database`.`race` SET `started`='"
							+ date.getTime() + "' WHERE `idRace`='" + pRaceId
							+ "'");
		}
	}

	/**
	 * Creates a race.
	 * 
	 * @param pGameId
	 *            The id of the game of the race.
	 * @param pRunId
	 *            The id of the run of the race.
	 * @param pSqlConnection
	 *            The sqlConnection to be used.
	 * @return
	 * @throws SQLException
	 */
	public static String CreateRace(String pGameId, String pRunId,
			Connection pSqlConnection) throws SQLException {
		Statement raceStatement = pSqlConnection.createStatement();
		raceStatement
				.executeUpdate("INSERT INTO `database`.`race` (`idGame`, `idRun`, `started`) VALUES ('"
						+ pGameId + "', '" + pRunId + "', '0')");

		Statement idStatement = pSqlConnection.createStatement();
		ResultSet idResult = idStatement
				.executeQuery("SELECT * FROM database.race WHERE idGame = '"
						+ pGameId + "' AND idRun = '" + pRunId + "'");

		if (idResult.last()) {
			return idResult.getString("idRace");
		}

		return null;
	}

}
