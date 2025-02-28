import React from 'react';
import './PredictedResults.css';

function PredictionResults({ lawViolations, selectedViolations, onViolationChange, onSubViolationChange }) {
  const violationsWithSubViolations = {
    "Driving Documentation Compliance Violation": [
      "02 - (1): Operating the motor vehicle without proper vehicle registation.",
      "25 - (1): Possessing and Operating a motor vehicle for which a revenue licence is not in force",
      "123 - (1) - (a): Driving without a valid driving license when committing the accident. - First Offence: Fine of Rs: 25,000",
      "123 - (1) - (a): Driving without a valid driving license when committing the accident. - Second Offence onward: Fine of Rs: 30,000",
      "99: Drving without a valid insurance policy or security against third-party risk ",
      "104: Failure to provide the certificate of insurance immediately to the police officier when requested. - Order to deliver it in person to the specified police station within 5 days",
      "218: Penalty for driving without a valid insurance certification - fine ranging from Rs.25,000 - 50,000 OR Imprisonment of not more than one month OR Both."
    ],
    "Public Safety Breaches from Hazardous Driving": [
      "151 (1A): Driving after the consumption of alcohol or drug, and reckless or negligent driving",
      "151 (1A): Causing deaths, or injuries to any person while driving under the influence of alcohol or drugs",
      "151 (1C): Presuming that driver was driving under the influence of alcohol or drugs, where the driver refused to undergo the Breathalyzer test and no evidence proves otherwise.",
      "216: Fine ranging from Rs. 25,000-30,000 OR Imprisonment not more than 3 months OR Both. And Suspension of the Driving License for not more than a year.",
      "216B(a): In case of a death, fine of Rs. 100,000-150,000 AND/OR Imprisonment between 2-10 years AND Cancellation of Driving License.",
      "216B(b)(i) : In case of causing minor injuries, Fine of Rs.30,000 - 50,000 AND/OR Imprisonment of not more than one year AND cancellation of Driving License.",
      "216B(b)(ii) : In case of causing severe injuries, fine of Rs.50,000- Rs. 100,000 AND/OR Imprisonment not more than 5 years AND Cancellation of Driving License.",
      "140 : Driving a vehicle at a speed exceeding the prescribed limit set by regulations.",
      "141A : Penalty for driving at an excessive speed is a Spot fine ranging from Rs.3000 - 15,000 based on the excessive speed percentage."
    ],
    "Unsafe Vehicle Condition and Road Safety Negligence": [
      "145: Using a motor vehicle on a highway in a condition that endangers or is likely to endanger people or property on or near the highway",
      "193: Operating a motor vehicle with suspected unfit mechanical condition or tyres on a highway.",
      "164 : Failure to obey authorized traffic signs or notices regulating traffic, including light signals, or erecting unauthorized traffic signs without proper authority.",
      "162 : Failure to obey verbal directions or signals from a police officer, such as instructions to stop, reverse, slow down, turn back, or follow specific traffic lanes.",
      "153 : Failure to use proper signals or prescribed hand signals for indicating turns, direction changes, or intentions, including unauthorized use of flashing lights.",
      "152(A) : Using mobile phone or any other distracted electronic device while driving. Spot Fine ranging from 2500-15,000"
    ],
    "Public Transportation Regulatory Compliance Violation": [
      "123-(1)-(b) : Employing a driver without a valid driving licence for motor vehicles of that class. - First Offence: Fine Ranging from Rs. 25,000 - 30,000",
      "123-(1)-(b) : Employing a driver without a valid driving licence for motor vehicles of that class. - Second Offence onward: Fine Ranging from Rs. 30,000 - 50,000",
      "74 : Using a private coach on any highway without a valid private coach permit granted by the Commissioner. ",
      "57 : Failing to comply with vehicle maintainance, fitness certification criteras that attached to a stage carriage permit, or not having a valid fitness certification."
    ],
  };

  return (
    <>
      {lawViolations.length > 0 ? (
        <div>
          <h3>Predicted Law Violations:</h3>
          <ul>
            {lawViolations.map((violation, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => onViolationChange(violation, e.target.checked)}
                  />
                  <strong>{violation}</strong>
                </label>
                {violationsWithSubViolations[violation] && (
                  <ul>
                    {violationsWithSubViolations[violation].map((subViolation, subIndex) => (
                      <li key={subIndex}>
                        <label>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              onSubViolationChange(violation, subViolation, e.target.checked)
                            }
                          />
                          {subViolation}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No law violations predicted.</p>
      )}

      {selectedViolations && selectedViolations.length > 0 && (
        <div>
          <h3>Accident-Specific Violations:</h3>
          <ul>
            {selectedViolations.map((violation, index) => (
              <li key={index}>{violation}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default PredictionResults;
