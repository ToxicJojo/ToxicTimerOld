package org.jojo.toxictimer.api.get;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jojo.toxictimer.api.BaseServlet;
import org.jojo.toxictimer.api.Race;
import org.jojo.toxictimer.api.exceptions.RaceNotFoundExcpetion;
import org.jojo.toxictimer.api.exceptions.RunnerNotFoundException;


@WebServlet("/get/Race")
public class GetRace extends BaseServlet {
	private static final long serialVersionUID = 1L;
       
    public GetRace() {
        super();
       servletName = "get/Race";
    }


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (this.ConnectToDatabase()) {
			if (this.SetUpWriter(response, request)) {
				try {
					String raceId = request.getParameter("raceId");
					if (ValidateNumber(raceId)) {
						this.WriteResponse(Race.GetRace(Integer.parseInt(raceId), sqlConnection));
					} else {
						responseCode = HttpServletResponse.SC_BAD_REQUEST;
					}
				} catch (SQLException e) {
					responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
					System.err.println("SQL Error (" + servletName + ")");
					e.printStackTrace();
				} catch (NumberFormatException e) {
					responseCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
					System.err.println("NumberFormat Error (" + servletName + ")");
					e.printStackTrace();
				} catch (RunnerNotFoundException e) {
					responseCode = HttpServletResponse.SC_NO_CONTENT;
					e.printStackTrace();
				} catch (RaceNotFoundExcpetion e) {
					responseCode = HttpServletResponse.SC_NO_CONTENT;
					e.printStackTrace();
				}
			}
			this.EndDatabaseConnection();
		}
		response.setStatus(responseCode);
	}

}
