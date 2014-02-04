package org.jojo.toxictimer.api;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.Configuration;

import com.google.gson.Gson;

@WebServlet("/BaseServlet")
public abstract class BaseServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected String callBack;
	protected String servletName;

	protected Connection sqlConnection;
	protected PrintWriter out;
	protected int responseCode = HttpServletResponse.SC_OK;

	private String validNumber = "0123456789";
	private String validName = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	private String validSplits = "0123456789;-";
	private String[] validStatus = {"hold", "ready", "finished"};

	public BaseServlet() {
		super();
	}

	/**
	 * Starts connection to the database.
	 * 
	 * @return Returns true if everything worked as expected returns false if
	 *         something went wrong.
	 */
	protected boolean ConnectToDatabase() {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			sqlConnection = DriverManager.getConnection("jdbc:mysql://"
					+ Configuration.databaseIp, Configuration.databaseUser,
					Configuration.databasePassword);
			return true;
		} catch (SQLException e) {
			responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			System.err.println("Failed to connect to the database.("
					+ servletName + ")");
			return false;
		} catch (ClassNotFoundException e) {
			responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			System.err.println("Could not find the driver class.");
			return false;
		}
	}

	/**
	 * Ends the connection to the database.
	 * 
	 * @return Returns true if everything worked as expected returns false if
	 *         something went wrong.
	 */
	protected boolean EndDatabaseConnection() {
		try {
			sqlConnection.close();
			return true;
		} catch (SQLException e) {
			responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			System.err.println("Failed to close the database connection. ("
					+ servletName + ")");
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * Sets up the writer used to write the response.
	 * 
	 * @param pResponse
	 *            The response to write.
	 * @return Returns true if everything worked as expected returns false if
	 *         something went wrong.
	 */
	protected boolean SetUpWriter(HttpServletResponse pResponse,
			HttpServletRequest pRequest) {
		try {
			pResponse.setContentType("application/json; charset=utf-8");
			callBack = pRequest.getParameter("callback");
			out = pResponse.getWriter();
			return true;
		} catch (IOException e) {
			responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * Writes the given object to the outstream as json.
	 * 
	 * @param pObject
	 *            The object to write into the response.
	 */
	protected void WriteResponse(Object pObject) {
		Gson gson = new Gson();

		out.println(callBack + "(" + gson.toJson(pObject) + ")");
		out.close();
	}

	/**
	 * Validates the given string by comparing it to the characters in the valid
	 * string.
	 * 
	 * @param pInput
	 *            The string to validate.
	 * @param pValid
	 *            The string which contains the allowed characters.
	 * @return True if the string is valid. False if the string is unvalid.
	 */
	protected boolean Validate(String pInput, String pValid) {
		boolean returnValue = false;
		if (pInput != null) {
			if (!pInput.isEmpty()) {
				returnValue = true;
				for (char digit : pInput.toCharArray()) {
					if (pValid.indexOf(digit) == -1) {
						return false;
					}
				}
			}
		}
		return returnValue;
	}
	
	/**
	 *  Validates the given string by comparing it to the allowed strings.
	 * @param pInput The string to validate
	 * @param pValid The array containing the valid strings
	 * @return Whether the string is valid or not.
	 */
	protected boolean Validate(String pInput, String[] pValid) {
		if (pInput != null) {
			if (!pInput.isEmpty()) {
				for (String string : pValid) {
					if (string.equals(pInput)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * Validates if the given string is a number.
	 * 
	 * @param pNumber
	 *            The string to validate.
	 * @return True if the string is a number. False if the string is a number.
	 */
	protected boolean ValidateNumber(String pNumber) {
		return this.Validate(pNumber, validNumber);
	}
	
	/**
	 * Validates if the given string is a valid name string
	 * @param pName The string to validate
	 * @return Whether the string is a valid name string
	 */
	protected boolean ValidateName(String pName) {
		return this.Validate(pName, validName);
	}
	
	/**
	 * Validates if the given string is a valid split string
	 * @param pNumber The string to validate
	 * @return Whether the string is a valid split string
	 */
	protected boolean ValidateSplits(String pSplits) {
		return this.Validate(pSplits, validSplits);
	}
	
	/**
	 * Validates if the given string is a valid status string
	 * @param pStatus The string to validate
	 * @return Whether the string is a valid status string
	 */
	protected boolean ValidateStatus(String pStatus) {
		return this.Validate(pStatus, validStatus);
	}

}
